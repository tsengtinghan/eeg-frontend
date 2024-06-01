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
  const [average, setAverage] = useState(0.5);
  const buffer = useRef([]);

  useEffect(() => {
    const socket = io("http://127.0.0.1:5001");

    socket.on("connect", () => {
      console.log("Socket connected");
      socket.emit("start_loop");
      console.log("Sent start_loop");
    });

    socket.on("average_amplitude", (data) => {
      console.log("Received average_amplitude: ", data);

      if (data < 300) {
        buffer.current.push(0);
      } else {
        buffer.current.push(1);
      }

      if (buffer.current.length > 3) {
        buffer.current = buffer.current.slice(-2); 
      }

      const sum = buffer.current.reduce((acc, val) => acc + val, 0);
      const avg = sum / buffer.current.length;
      setAverage(avg);

      if (avg < 0.5) {
        setDrawerIsOpen(true);
      }
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected");
    });

    return () => {
      socket.close();
    };
  }, []);

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
          <div className="text-xl">
            {average < 0.5 ? "You are not focused" : "You are focused"}
            <br />
            Focus level: {average}
          </div>
          <Progress className="w-full" value={average * 100} />
        </div>
      </div>
    </div>
  );
};

export default EEGComponent;
