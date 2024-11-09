import { forwardRef, MutableRefObject } from "react";
import { IconType } from "react-icons";

export type FormFieldProps = {
  placeholder: string;
  name: string;
  type: "EMAIL" | "PASSWORD" | "TEXTAREA" | "TEXT";
  error?: string;
  icon?: IconType;
  label?: string;
};

const FormField = forwardRef<
  HTMLTextAreaElement | HTMLInputElement,
  FormFieldProps
>(({ label, type, error, icon: Icon, ...rest }, ref) => {
  return (
    <>
      <label className="input input-bordered flex items-center gap-2">
        {/* Show label, otherwise show icon */ !label ? Icon && <Icon /> : null}
        {type === "TEXTAREA" ? (
          <textarea
            ref={ref as MutableRefObject<HTMLTextAreaElement>}
            {...rest}
          />
        ) : (
          <input
            ref={ref as MutableRefObject<HTMLInputElement>}
            className="grow"
            type={type}
            {...rest}
          />
        )}
      </label>
      {error && (
        <span className="inline-flex text-red-600 text-sm font-semibold">
          {error}
        </span>
      )}
    </>
  );
});
export default FormField;
