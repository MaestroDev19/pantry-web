import { FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field";
import { cn } from "@/lib/utils";

export function ConfirmForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <FieldGroup>
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-xl font-bold">Confirm your email</h1>
          <FieldDescription className="space-y-4">
            <p>
              Check your inbox — we&apos;ve sent you a confirmation link. Click
              it to verify your email and activate your account.
            </p>
            <p>
              Can&apos;t find it? Check your spam folder. Once you&apos;ve
              confirmed, you can close this tab and sign in.
            </p>
          </FieldDescription>
        </div>
      </FieldGroup>
    </div>
  );
}
