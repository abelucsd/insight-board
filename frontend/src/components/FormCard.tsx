
interface FormCardProps {
  children: React.ReactNode;
}

const FormCard = ({children}: FormCardProps) => {

  return (
    <div className="
      flex flex-col justify-between overflow-x-auto overflow-y-hidden
      border border-[var(--card-border)] rounded-2xl px-8 py-6 bg-white
    ">
      {children}
    </div>
  )
}

export default FormCard;