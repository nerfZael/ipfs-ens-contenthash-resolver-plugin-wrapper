import {
  Client,
  Module,
  Args_tryResolveUri,
  Args_getFile,
  UriResolver_MaybeUriOrManifest,
  Bytes,
  manifest,
} from "./wrap";
import { Base58 } from "@ethersproject/basex";
import { ethers } from "ethers";
import { PluginFactory } from "@polywrap/core-js";

export interface IpfsEnsContenthashResolverPluginConfig {
}

export class IpfsEnsContenthashResolverPlugin extends Module<IpfsEnsContenthashResolverPluginConfig> {
  constructor(config?: IpfsEnsContenthashResolverPluginConfig) {
    super(config ?? {});
  }

  async tryResolveUri(
    args: Args_tryResolveUri,
    client: Client
  ): Promise<UriResolver_MaybeUriOrManifest | null> {
    if (args.authority === "ens-contenthash") {
      if (
        args.path.substring(0, 10) === "0xe3010170" &&
        ethers.utils.isHexString(args.path, 38)
      ) {
        const cid = Base58.encode(ethers.utils.hexDataSlice(args.path, 4));
       
        return {
          uri: `wrap://ipfs/${cid}`,
          manifest: null,
        };
      } 
    } 

    return this.notFound();
  }

  async getFile(args: Args_getFile, _client: Client): Promise<Bytes | null> {
    return null;
  }

  private notFound(): UriResolver_MaybeUriOrManifest {
    return { uri: null, manifest: null };
  }
}

export const ipfsEnsContenthashResolverPlugin: PluginFactory<IpfsEnsContenthashResolverPluginConfig> = (
  config?: IpfsEnsContenthashResolverPluginConfig
) => {
  return {
    factory: () => new IpfsEnsContenthashResolverPlugin(config),
    manifest,
  };
};

export const plugin = ipfsEnsContenthashResolverPlugin;
