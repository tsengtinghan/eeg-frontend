import React, { useEffect, useState, useRef } from "react";
import io from "socket.io-client";
import { Button } from "@/components/ui/button";
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

const EEGComponent = () => {
  const [message, setMessage] = useState("default message");
  const [isDrawerOpen, setDrawerIsOpen] = useState(false);
  const buffer = useRef([]);

  useEffect(() => {
    const socket = io("http://127.0.0.1:5000");

    socket.on("eegData", (data) => {
      buffer.current.push(data);

      if (buffer.current.length >= 50) {
        // Adjust based on data rate
        const sum = buffer.current.reduce(
          (acc, val) => acc + parseInt(val, 10),
          0
        );
        const avg = sum / buffer.current.length;

        if (avg > 0.5) {
          performActionForMostlyOnes();
        } else {
          performActionForMostlyZeros();
        }

        buffer.current = []; // Clear the buffer
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
      <p>{message}</p>
      <Drawer open={isDrawerOpen} onOpenChange={setDrawerIsOpen}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Are you still there?</DrawerTitle>
            <DrawerDescription>This action cannot be undone.</DrawerDescription>
          </DrawerHeader>
          <DrawerFooter>
            <Button>Submit</Button>
            <DrawerClose>
              <Button variant="outline">Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  );
};

export default EEGComponent;
