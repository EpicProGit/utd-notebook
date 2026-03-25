import { useFieldContext } from '@src/utils/form';
import { Checkbox } from '@mui/material';
import { FormControlLabel } from '@mui/material';

interface FormCheckboxProps {
    label?: string;
    className?: string
};

export default function FormCheckbox({
  label,
  className
}: FormCheckboxProps) {
    const field = useFieldContext<boolean>();

    return (
        <FormControlLabel
          control={<Checkbox 
                    checked = { field.state.value ?? false }
                    onChange={ (e) => field.handleChange(e.target.checked) }/>}
          label={ label }
          className={ className }>
        </FormControlLabel>
    )
}