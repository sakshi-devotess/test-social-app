export interface IAnimalForm {
  methods?: any;
  onSubmit?: (data: IAnimal) => void;
  isEdit?: boolean;
  setImage: (image: any) => void;
  image?: any;
  handleClose: () => void;
}

export interface IAnimalList {
  data: IAnimal[];
  selectedData: IAnimal[];
  setSelectedData: (value: IAnimal[]) => void;
  openNew?: () => void;
}

export interface ICreateAnimal {
  setAnimalDialog: (data: boolean) => void;
}
export interface IUpdateAnimal {
  setAnimalDialog: (data: boolean) => void;
  data?: IAnimal;
}
export interface IAnimal {
  id: number;
  file_id: number;
  name: string;
  type: number | null;
  breed_type: number | null;
  created: string;
  animal_image?: string | null;
  created_by_company_has_user_id: number;
}

export type IAnimalInitialValues = Partial<IAnimal>;
