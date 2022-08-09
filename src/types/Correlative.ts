export type Correlative = {
  regular: boolean,
  approve: boolean
} | boolean;

export type CorrelativeDB = {
  [index: string]: Correlative 
}