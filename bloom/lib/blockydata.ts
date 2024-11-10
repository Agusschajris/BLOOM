import {compress, decompress, trimUndefinedRecursively} from "compress-json";

export type ArgValue = undefined | null | StoredArgValue;

export type StoredArgValue = boolean | number | [number] | [number, number] | [number, number, number] | string;

export interface DataBlock {
  id: number;
  visualName: string;
  funName: string;
  args: { [key: string]: StoredArgValue };
}

export type Block = {
  visualName: string;
  exp: string;
  category: string;
  funName: string;
  args: Argument[];
};

export type Argument = {
  visualName: string;
  exp: string;
  argName: string;
  type: string;
  values: undefined | null | string | (string | null)[];
  default: ArgValue;
  value: ArgValue;
};

export interface BlockInstance extends Block {
  id: string;
}

export function decompressBlocks(data: string): DataBlock[] {
  return decompress(JSON.parse(data));
}

export function compressBlocks(blocks: DataBlock[]): string {
  // 0 trim Blocks
  trimUndefinedRecursively(blocks);
  // 1 compress blocks
  const compressedBlocks = compress(blocks);
  return JSON.stringify(compressedBlocks);
}