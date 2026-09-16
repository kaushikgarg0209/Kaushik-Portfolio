import { revalidatePath } from "next/cache";

export function revalidatePortfolio() {
  // Layout holds Navbar (site name, section visibility)
  revalidatePath("/", "layout");
  revalidatePath("/");
  revalidatePath("/projects", "layout");
}
