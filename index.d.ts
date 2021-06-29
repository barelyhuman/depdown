declare enum EMode {
  dev,
  direct,
  peer,
}

declare type Options = {
  mode: keyof typeof EMode;
};

export declare const depdown: (
  deps: string[],
  options: Options
) => Promise<void>;
