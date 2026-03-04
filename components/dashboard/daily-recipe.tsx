"use client";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import {
  Item,
  ItemTitle,
  ItemContent,
  ItemMedia,
  ItemActions,
  ItemDescription,
} from "@/components/ui/item";
import { ExternalLinkIcon } from "lucide-react";
import Image from "next/image";
import { Badge } from "../ui/badge";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Clock01FreeIcons,
  StarCircleFreeIcons,
  UserGroup02FreeIcons,
  ChefHatFreeIcons,
} from "@hugeicons/core-free-icons";

export function DailyRecipe() {
  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HugeiconsIcon icon={ChefHatFreeIcons} strokeWidth={2} />
            Chef&apos;s daily choice
          </CardTitle>
          <CardDescription>
            Save your ingredients and prevent food waste
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Item
            variant="outline"
            render={
              <a href="#" rel="noopener noreferrer">
                <ItemContent className="flex flex-col gap-2">
                  <ItemTitle>Honey Garlic Chicken Stir Fry</ItemTitle>
                  <ItemDescription>
                    A quick and easy stir fry with honey garlic sauce based on
                    your pantry.
                  </ItemDescription>
                  <div className="flex gap-2">
                    <Badge variant="default">
                      <HugeiconsIcon icon={Clock01FreeIcons} strokeWidth={2} />
                      <span>30 minutes</span>
                    </Badge>
                    <Badge variant="secondary">
                      <HugeiconsIcon
                        icon={UserGroup02FreeIcons}
                        strokeWidth={2}
                      />
                      <span>4 servings</span>
                    </Badge>
                  </div>
                </ItemContent>
                <ItemActions>
                  <ExternalLinkIcon className="size-4" />
                </ItemActions>
              </a>
            }
          />
        </CardContent>
      </Card>
    </div>
  );
}
