"use client";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

export default function ShadcnComparison() {
  return (
    <section className="space-y-6">
      <h2 className="text-2xl font-semibold">shadcn comparison</h2>

      <Tabs defaultValue="overview">
        <TabsList aria-label="shadcn playground information">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="keyboard">Keyboard</TabsTrigger>
          <TabsTrigger value="about">About</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          These tabs use shadcn components backed by Radix.
        </TabsContent>
        <TabsContent value="keyboard">
          Test arrow keys, Home, End and Tab.
        </TabsContent>
        <TabsContent value="about">
          Compare this implementation with our custom tabs above.
        </TabsContent>
      </Tabs>

      <Dialog>
        <DialogTrigger asChild>
          <Button>Open shadcn modal</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>shadcn modal comparison</DialogTitle>
            <DialogDescription>
              Test Tab, Shift+Tab and Escape. Closing should return
              focus to the opening button.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Done</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
}
