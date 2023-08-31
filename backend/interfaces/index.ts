export interface Contract {
  signer?: string;
  contract: string;
}

export interface DeployArgument {
  name: string;
  params: string[];
}
