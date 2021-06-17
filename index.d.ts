declare enum TreeE {
  dev = "dev",
  direct = "direct",
  peer = "peer",
}

declare type Options = {
  tree: TreeE;
};

export declare const depdown: (
  deps: string[],
  { tree }: Options
) => Promise<void>;
