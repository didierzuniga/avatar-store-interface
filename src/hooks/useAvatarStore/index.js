import { useMemo } from "react";
import { useWeb3React } from "@web3-react/core";
import AvatarStoreArtifact from "../../config/web3/artifacts/AvatarStore";

const { address, abi } = AvatarStoreArtifact;

const useAvatarStore = () => {
  const { active, library, chainId } = useWeb3React();

  const avatarStore = useMemo(() => {
    if (active) return new library.eth.Contract(abi, address[chainId]);
  }, [active, chainId, library?.eth?.Contract]);

  return avatarStore;
};

export default useAvatarStore;