import { UserSection } from '../sections/user-section'

interface UserViewProps {
  userId: string
}

export const UserView = ({ userId }: UserViewProps) => {
  return (
    <div className="mx-auto mb-10 flex max-w-screen-md flex-col gap-y-6 px-4 pt-2.5">
      <UserSection userId={userId} />
    </div>
  )
}
