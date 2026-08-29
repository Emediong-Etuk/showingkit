import { Link } from "@tanstack/react-router";
import { PublicLayout, PageHero } from "@/components/layout/public-layout";
import { buttonVariants } from "@/components/ui/kit";

export function NotFoundPage() {
  return (
    <PublicLayout>
      <PageHero
        kicker="404"
        title="This address is not on the clipboard."
        lede="The route does not exist. The units on the board still do."
        action={
          <div className="flex flex-wrap gap-3">
            <Link to="/" className={buttonVariants()}>
              Home
            </Link>
            <Link to="/app/showings" className={buttonVariants({ variant: "outline" })}>
              Showings
            </Link>
          </div>
        }
      />
    </PublicLayout>
  );
}
