type Props = {
  label: string;
  value: string | number | null | undefined;
  isDisabled?: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export function Input({ label, value, isDisabled = false, onChange }: Props) {
  return (
    <>
      {isDisabled ? (
        <div className=" flex flex-col gap-2 relative bg-(--bgdisabled) rounded-lg p-2">
          <label className="text-(--disabledlabel) 24 absolute text-[12px] top-1 left-2">
            {label}
          </label>
          <input
            id="column"
            disabled={isDisabled}
            value={value ?? "-"}
            className="pt-3 text-(--disabledtext) outline-none  bg-(--bgdisabled) placeholder:text-gray-400"
          />
        </div>
      ) : (
        <div className="flex flex-col gap-2 relative bg-(--magnolia) rounded-lg p-2">
          <label className="text-(--bittersweet) 24 absolute text-[12px] top-1 left-2">
            {label}
          </label>
          <input
            onChange={onChange}
            value={value ?? ""}
            className="pt-3 text-(--ultraviolet) outline-none bg-(--magnolia) placeholder:text-gray-400"
          />
        </div>
      )}
    </>
  );
}
