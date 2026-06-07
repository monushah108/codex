"use client";

import { useState, useTransition } from "react";
import { Input } from "../ui/input";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldDescription,
  FieldError,
} from "../ui/field";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { PasswordInput } from "../ui/password-input";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Spinner } from "../ui/spinner";
import { useRouter } from "next/navigation";
import { playSchema } from "@/lib/schema/playground";
import { CircleAlert } from "lucide-react";

export default function Form() {
  const [name, setRoomName] = useState("codex");
  const [roomType, setRoomType] = useState<"public" | "private">("public");
  const [password, setPassword] = useState("12345678");
  const [duration, setDuration] = useState(false);

  const [errors, setErrors] = useState<
    Partial<
      Record<
        "maxUser" | "duration" | "password" | "name" | "roomType",
        string[]
      >
    >
  >({});

  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const inputErrorClass = (field?: string[]) =>
    field
      ? "border-destructive focus-visible:ring-destructive"
      : "bg-[#1e1e1e] border-[#2d2d30]";

  const handleForm = async (formData: FormData) => {
    startTransition(async () => {
      const newRoom = {
        name,
        type: roomType,
        password: roomType === "private" ? password : undefined,
        duration,
      };

      const { success, data, error } = playSchema.safeParse(newRoom);
      console.log(success, data, error, newRoom);
      if (!success) {
        const formatted = error.flatten().fieldErrors;
        setErrors(formatted);

        return;
      }

      try {
        const response = await fetch("/api/playground", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(data),
        });

        const result = await response.json();

        console.log(result);

        if (response.status === 201) {
          toast.success("Room created successfully!");
          router.push(`/playground/${result.roomId}`);
        }

        if (response.status === 422) {
          toast.error(result.error || "Validation failed");
        }
        if (response.status === 409) {
          toast.error(result.error || "A room with this name already exists");
        }

        setErrors({});
      } catch (err) {
        console.log(err);
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
            value={name}
            onChange={(e) => setRoomName(e.target.value)}
            name="name"
            placeholder="Enter a room title"
            className={inputErrorClass(errors.name)}
          />

          {errors.name && (
            <FieldError className="text-destructive text-xs flex items-center gap-1">
              <CircleAlert className="h-3 w-3" />
              {errors.name[0]}
            </FieldError>
          )}
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
                className="text-sky-500 data-[state=checked]:bg-sky-500 data-[state=checked]:text-white"
                value="public"
                id="public"
              />
              <FieldLabel htmlFor="public">Public</FieldLabel>
            </div>

            <div className="flex items-center space-x-2">
              <RadioGroupItem
                className="text-sky-500 data-[state=checked]:bg-sky-500 data-[state=checked]:text-white"
                value="private"
                id="private"
              />
              <FieldLabel htmlFor="private">Private</FieldLabel>
            </div>
          </RadioGroup>
        </Field>

        {/* Password */}
        {roomType === "private" && (
          <Field>
            <FieldLabel>Access Password</FieldLabel>

            <PasswordInput
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter room password"
              className={inputErrorClass(errors.password)}
            />

            {errors.password && (
              <FieldError className="text-destructive text-xs flex items-center gap-1">
                <CircleAlert className="h-3 w-3" />
                {errors.password[0]}
              </FieldError>
            )}
          </Field>
        )}

        {/* Duration */}
        <Field>
          <FieldLabel>Room Duration</FieldLabel>

          <RadioGroup
            value={duration}
            onValueChange={setDuration}
            className="flex gap-6"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem
                className="text-sky-500 data-[state=checked]:bg-sky-500 data-[state=checked]:text-white"
                value="true"
                id="true"
              />
              <FieldLabel htmlFor="true">No Expiration</FieldLabel>
            </div>

            <div className="flex items-center space-x-2">
              <RadioGroupItem
                className="text-sky-500 data-[state=checked]:bg-sky-500 data-[state=checked]:text-white"
                value="false"
                id="false"
              />
              <FieldLabel htmlFor="false">Expires in 7 Days</FieldLabel>
            </div>
          </RadioGroup>
        </Field>

        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? <Spinner className="h-4 w-4" /> : "Create Room"}
        </Button>
      </FieldGroup>
    </form>
  );
}
