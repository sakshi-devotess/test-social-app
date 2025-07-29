import React, { useState, useEffect } from 'react';
import DropDownPicker from 'react-native-dropdown-picker';
import { View, Text, StyleSheet, Keyboard } from 'react-native';
import { useFormContext } from 'react-hook-form';
import { useCapitalizedTranslation } from '../../../hooks/useCapitalizedTranslation';

interface PickerItem {
  label: string;
  value: string | number;
}

interface FormPickerProps {
  value: number | null | string;
  onChange: (value: string | number) => void;
  placeholder: string;
  items: PickerItem[];
  errorMessage?: string;
  attribute?: string;
  searchable?: boolean;
}

export default function FormPicker({
  value,
  onChange,
  placeholder,
  items,
  errorMessage,
  attribute = '',
  searchable = false,
}: FormPickerProps) {
  const [open, setOpen] = useState(false);
  const [pickerItems, setPickerItems] = useState<PickerItem[]>(items);
  const { t } = useCapitalizedTranslation();

  let formContext;
  try {
    formContext = useFormContext();
  } catch (e) {
    formContext = null;
  }
  const error: string =
    (errorMessage ?? String(formContext?.formState?.errors?.[attribute]?.message || '')) || '';

  useEffect(() => {
    setPickerItems(items);
  }, [items]);

  const handleOpen = () => {
    Keyboard.dismiss();
    setOpen(true);
  };

  return (
    <View>
      <DropDownPicker
        open={open}
        value={value}
        items={pickerItems}
        setOpen={setOpen}
        onOpen={handleOpen}
        setValue={(callback) => {
          const selectedValue = callback(value);
          onChange(selectedValue);
        }}
        setItems={setPickerItems}
        placeholder={placeholder}
        style={[styles.dropdown, error ? styles.errorBorder : null]}
        dropDownContainerStyle={styles.dropdownContainer}
        listMode="SCROLLVIEW"
        scrollViewProps={{
          keyboardShouldPersistTaps: 'handled',
          nestedScrollEnabled: true,
        }}
        searchable={searchable}
        searchPlaceholder={t('components.search.placeholder')}
        searchTextInputStyle={styles.searchTextInput}
        autoScroll={true}
        onSelectItem={(item) => {
          onChange(item.value);
          setTimeout(() => {
            Keyboard.dismiss();
            setOpen(false);
          }, 100);
        }}
      />

      {!!error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    zIndex: 1000,
    marginBottom: 5,
  },
  dropdown: {
    backgroundColor: '#F6F7FB',
    borderRadius: 10,
    borderColor: '#ccc',
    minHeight: 50,
  },
  dropdownContainer: {
    backgroundColor: '#F6F7FB',
    borderColor: '#ccc',
    borderRadius: 10,
    maxHeight: 250,
  },
  errorBorder: {
    borderColor: 'red',
    borderWidth: 1,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 4,
  },
  searchTextInput: {
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 40,
  },
});
