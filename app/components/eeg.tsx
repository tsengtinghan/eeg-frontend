import React, { useEffect, useState, useRef } from "react";
import io from "socket.io-client";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import YtPlayer from "./ytplayer";

const EEGComponent = () => {
  const [message, setMessage] = useState("default message");
  const [isDrawerOpen, setDrawerIsOpen] = useState(false);
  const [average, setAverage] = useState(0);
  const buffer = useRef([]);

  useEffect(() => {
    const socket = io("http://127.0.0.1:5001");

    socket.on("connect", () => {
      console.log("Socket connected");
    });

    socket.on("eegData", (data) => {
      console.log("Received eegData: ", data);
      buffer.current.push(data);

      if (buffer.current.length >= 50) {
        // adjust based on data rate
        const sum = buffer.current.reduce(
          (acc, val) => acc + parseInt(val, 10),
          0
        );
        const avg = sum / buffer.current.length;
        setAverage(avg);
        if (avg > 0.5) {
          performActionForMostlyOnes();
        } else {
          performActionForMostlyZeros();
        }

        buffer.current = []; // clear the buffer
      }
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected");
    });

    return () => {
      socket.close();
    };
  }, []);

  const performActionForMostlyOnes = () => {
    setMessage("Mostly 1s received");
    setDrawerIsOpen(true);
  };

  const performActionForMostlyZeros = () => {
    setMessage("Mostly 0s received");
    // Add the action to be performed
  };

  return (
    <div>
      <h1>EEG Data Analysis</h1>
      <Drawer open={isDrawerOpen} onOpenChange={setDrawerIsOpen}>
        <DrawerTrigger>Open</DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Are you still there?</DrawerTitle>
            <DrawerDescription>
              Your brainwave said you're not paying attention.
            </DrawerDescription>
          </DrawerHeader>
          <DrawerFooter>
            <DrawerClose>
              <Button>Yes Sir</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
      <div className="flex flex-row items-center space-x-4 pt-10 pl-10">
        <YtPlayer isPlaying={!isDrawerOpen} />
        <div className="flex flex-col w-96 h-40 space-y-5 pl-10">
          <div className="text-xl">your focus level: {average}</div>
          <Progress className="w-full" value={average * 100} />
        </div>
      </div>
    </div>
  );
};

export default EEGComponent;
