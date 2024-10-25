import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TrashIcon, XIcon } from "lucide-react";
import { DeleteAccountButton } from "./delete-account-button";

export async function DeleteAccountCard() {
  return (
    <Card className="border-destructive">
      <CardHeader>
        <CardTitle className="text-destructive">Delete account</CardTitle>
        <CardDescription className="leading-relaxed">
          Delete your account and all of its data on this platform.
          <br />
          This includes your profile, items, wishlist, transaction history and
          settings.
          <br />
          You will be asked to confirm this action, but anyway proceed with
          caution.
        </CardDescription>
      </CardHeader>
      <CardFooter>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button className="bg-destructive">
              <TrashIcon className="size-4 mr-2" />
              Request to delete
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription className="space-y-1.5">
                <span className="inline-block">
                  Your account will immediately be deactivated. But for safety
                  reasons, we will keep your data for another 30 days before
                  permanently deleting it.
                </span>
                <span className="inline-block">
                  If you change your mind during this period, you can cancel the
                  deletion by contacting our support team.
                </span>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>
                <XIcon className="size-4 mr-2" />
                Cancel
              </AlertDialogCancel>
              <DeleteAccountButton />
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardFooter>
    </Card>
  );
}
