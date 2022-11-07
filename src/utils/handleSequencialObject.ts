type SequentObject<SequencialProp extends string> = {
  [key in SequencialProp]: string;
};

interface IhandleSequencialObject {
  <Prop extends string, Object extends object>(
    sequencialProp: Prop,
    quantity: number,
    prefix?: string,
    otherPropsObject?: Object
  ): (SequentObject<Prop> & Object)[];
  <Prop extends string, Object extends object>(
    sequencialProp: Prop,
    quantity: number,
    otherPropsObject?: Object
  ): (SequentObject<Prop> & Object)[];
  <Prop extends string, Object extends object>(
    sequencialProp: Prop,
    start: number,
    end: number,
    otherPropsObject?: Object
  ): (SequentObject<Prop> & Object)[];
  <Prop extends string, Object extends object>(
    sequencialProp: Prop,
    start: number,
    end: number,
    prefix?: string,
    otherPropsObject?: Object
  ): (SequentObject<Prop> & Object)[];
}

const handleSequencialObject: IhandleSequencialObject = (
  sequencialProp,
  start,
  end,
  prefix: string | object = "",
  otherPropsObject?: object | null
) => {
  if (typeof prefix === "object") {
    otherPropsObject = prefix;
    prefix = "";
  }

  if (typeof end === "string") {
    prefix = end;
  }

  if (typeof end === "object") {
    otherPropsObject = end;
  }

  if (typeof end !== "number") {
    end = start;
    start = 1;
  }

  const array: (SequentObject<typeof sequencialProp> &
    typeof otherPropsObject)[] = [];

  for (let i = start; i <= end!; i++) {
    const element: any = { ...otherPropsObject };
    element[sequencialProp] = prefix + i;

    array.push(element);
  }

  return array;
};

export { handleSequencialObject };
