"use client";
import { useState, useTransition } from "react";
import { Input } from "../ui/input";
import { Field, FieldGroup, FieldLabel, FieldDescription } from "../ui/field";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { PasswordInput } from "../ui/password-input";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Spinner } from "../ui/spinner";
import { useRouter } from "next/navigation";

export default function Form() {
  const [roomName, setRoomName] = useState("codex-room");
  const [roomType, setRoomType] = useState<"public" | "private">("public");
  const [password, setPassword] = useState("12345678");
  const [maxUser, setMaxUser] = useState("3");
  const [duration, setDuration] = useState("lifetime");

  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleForm = async () => {
    startTransition(async () => {
      try {
        const response = await fetch("/api/join", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            roomName,
            roomType,
            password: roomType === "private" ? password : undefined,
            maxUser,
            duration,
          }),
        });
        const data = await response.json();
        if (response.status === 201) {
          toast.success("Room created successfully!");
          router.push(`/playground/${data.room.id}`);
        }
        if (response.status === 422) {
          toast.error(Object.values(data).join(", "));
        }
      } catch {
        toast.error("A server error occurred. Please try again.");
      }
    });
  };

  return (
    <form action={handleForm} className="w-full max-w-md space-y-6">
      <FieldGroup>
        {/* Room Title */}
        <Field>
          <FieldLabel>Room Title</FieldLabel>
          <FieldDescription>
            Give your collaboration room a unique name.
          </FieldDescription>

          <Input
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
            placeholder="Enter a room title"
            className="bg-[#1e1e1e] border-[#2d2d30]"
          />
        </Field>

        {/* Room Visibility */}
        <Field>
          <FieldLabel>Room Visibility</FieldLabel>

          <RadioGroup
            value={roomType}
            onValueChange={(value) =>
              setRoomType(value as "public" | "private")
            }
            className="flex gap-6"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem
                value="public"
                id="public"
                className="text-sky-500 data-[state=checked]:bg-sky-500 data-[state=checked]:text-white"
              />
              <FieldLabel htmlFor="public">Public</FieldLabel>
            </div>

            <div className="flex items-center space-x-2">
              <RadioGroupItem
                value="private"
                id="private"
                className="text-sky-500 data-[state=checked]:bg-sky-500 data-[state=checked]:text-white"
              />
              <FieldLabel htmlFor="private">Private</FieldLabel>
            </div>
          </RadioGroup>

          {roomType === "private" && (
            <div className="mt-3">
              <FieldLabel>Access Password</FieldLabel>
              <PasswordInput
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter room password"
              />
            </div>
          )}
        </Field>

        {/* Room Duration */}
        <Field>
          <FieldLabel>Room Duration</FieldLabel>

          <RadioGroup
            value={duration}
            onValueChange={setDuration}
            className="flex gap-6"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem
                value="lifetime"
                id="lifetime"
                className="text-sky-500 data-[state=checked]:bg-sky-500 data-[state=checked]:text-white"
              />
              <FieldLabel htmlFor="lifetime">No Expiration</FieldLabel>
            </div>

            <div className="flex items-center space-x-2">
              <RadioGroupItem
                value="one-week"
                id="week"
                className="text-sky-500 data-[state=checked]:bg-sky-500 data-[state=checked]:text-white"
              />
              <FieldLabel htmlFor="week">Expires in 7 Days</FieldLabel>
            </div>
          </RadioGroup>
        </Field>

        {/* Maximum Participants */}
        <Field>
          <FieldLabel>Maximum Participants</FieldLabel>

          <Input
            type="number"
            placeholder="Maximum participants (e.g. 4)"
            value={maxUser}
            onChange={(e) => setMaxUser(e.target.value)}
          />
        </Field>

        {/* Create Room */}
        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? <Spinner className="h-4 w-4" /> : "Create Room"}
        </Button>
      </FieldGroup>
    </form>
  );
}
