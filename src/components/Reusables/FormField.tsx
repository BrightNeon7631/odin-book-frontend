import {
  FieldError,
  UseFormRegister,
  FieldValues,
  Path,
} from 'react-hook-form';

type FormFieldProps<T extends FieldValues> = {
  type: string;
  placeholder: string;
  Icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  // ensures the name is a valid key of the form data type
  name: Path<T>;
  register: UseFormRegister<T>;
  // represents any validation error associated with the field; it can be undefined if there are no errors
  error: FieldError | undefined;
  // a boolean flag indicating whether the field value should be treated as a number; defaults to undefined
  valueAsNumber?: boolean;
};

export default function FormField<T extends FieldValues>({
  type,
  name,
  placeholder,
  Icon,
  register,
  error,
  valueAsNumber,
}: FormFieldProps<T>) {
  return (
    <div className='relative'>
      <input
        type={type}
        placeholder={placeholder}
        className={`${
          error ? 'border-2 border-rose-500' : ''
        } h-10 w-full rounded-md bg-[#212835] pl-10 text-white`}
        // the register syntax is used to register the input field with the form, enabling form state management
        {...register(name, { valueAsNumber })}
      />
      {Icon && <Icon className='absolute top-2.5 left-3 text-xl text-white' />}
      {error && <span className='text-rose-500'>{error.message}</span>}
    </div>
  );
}
