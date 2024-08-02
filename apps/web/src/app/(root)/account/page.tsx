import { AccountWrapper } from "./_components/wrapper";
import { AccountLink } from "./_components/AccountLink";
import { ButtonLogout } from "./_components/ButtonLogout";
import { AccountVoucher } from "./_components/AccountVoucher";

export default function AccountPage() {
  return (
    <main className="min-h-dvh w-full bg-secondary">
      <AccountWrapper>
        {/* Voucher */}

        <div className="px-4 xl:px-0">
          <div className="flex size-full flex-col rounded-md border border-card bg-background p-2 shadow sm:px-4 sm:py-6 max-w-screen-lg mx-auto">
            <AccountLink />

            <ButtonLogout />
          </div>
        </div>
      </AccountWrapper>
    </main>
  );
}
