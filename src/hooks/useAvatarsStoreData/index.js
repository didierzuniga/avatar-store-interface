import { useWeb3React } from "@web3-react/core";
import { useCallback, useEffect, useState } from "react";
import useAvatarStore from "../useAvatarStore";

const getAvatarData = async ({ avatarStore, tokenId }) => {
  const [
    tokenURI,
    dna,
    owner,
    accessoriesType,
    clotheColor,
    clotheType,
    eyeType,
    eyeBrowType,
    facialHairColor,
    facialHairType,
    hairColor,
    hatColor,
    graphicType,
    mouthType,
    skinColor,
    topType,
  ] = await Promise.all([
    avatarStore.methods.tokenURI(tokenId).call(),
    avatarStore.methods.tokenDNA(tokenId).call(),
    avatarStore.methods.ownerOf(tokenId).call(),
    avatarStore.methods.getAccessoriesType(tokenId).call(),
    avatarStore.methods.getAccessoriesType(tokenId).call(),
    avatarStore.methods.getClotheColor(tokenId).call(),
    avatarStore.methods.getClotheType(tokenId).call(),
    avatarStore.methods.getEyeType(tokenId).call(),
    avatarStore.methods.getEyeBrowType(tokenId).call(),
    avatarStore.methods.getFacialHairColor(tokenId).call(),
    avatarStore.methods.getFacialHairType(tokenId).call(),
    avatarStore.methods.getHairColor(tokenId).call(),
    avatarStore.methods.getHatColor(tokenId).call(),
    avatarStore.methods.getGraphicType(tokenId).call(),
    avatarStore.methods.getMouthType(tokenId).call(),
    avatarStore.methods.getSkinColor(tokenId).call(),
    avatarStore.methods.getTopType(tokenId).call(),
  ]);

  const responseMetadata = await fetch(tokenURI);
  const metadata = await responseMetadata.json();

  return {
    tokenId,
    attributes: {
      accessoriesType,
      clotheColor,
      clotheType,
      eyeType,
      eyeBrowType,
      facialHairColor,
      facialHairType,
      hairColor,
      hatColor,
      graphicType,
      mouthType,
      skinColor,
      topType,
    },
    tokenURI,
    dna,
    owner,
    ...metadata,
  };
};

// Plural
const useAvatarsStoreData = ({ owner = null } = {}) => {
  const [avatar, setAvatar] = useState([]);
  const { library } = useWeb3React();
  const [loading, setLoading] = useState(true);
  const avatarStore = useAvatarStore();

  const update = useCallback(async () => {
    if (avatarStore) {
      setLoading(true);

      let tokenIds;

      if (!library.utils.isAddress(owner)) {
        const totalSupply = await avatarStore.methods.totalSupply().call();
        tokenIds = new Array(Number(totalSupply)).fill().map((_, index) => index);
      } else {
        const balanceOf = await avatarStore.methods.balanceOf(owner).call();
        const tokenIdsOfOwner = new Array(Number(balanceOf)).fill().map((_, index) => avatarStore.methods.tokenOfOwnerByIndex(owner, index).call());

        tokenIds = await Promise.all(tokenIdsOfOwner);
      }

      const avatarsPromise = tokenIds.map((tokenId) =>
        getAvatarData({ tokenId, avatarStore })
      );

      const avatar = await Promise.all(avatarsPromise);

      setAvatar(avatar);
      setLoading(false);
    }
  }, [avatarStore, owner, library?.utils]);

  useEffect(() => {
    update();
  }, [update]);

  return {
    loading,
    avatar,
    update,
  };
};

// Singular
const useAvatarStoreData = (tokenId = null) => {
  const [avatar, setAvatar] = useState({});
  const [loading, setLoading] = useState(true);
  const avatarStore = useAvatarStore();

  const update = useCallback(async () => {
    if (avatarStore && tokenId != null) {
      setLoading(true);

      const toSet = await getAvatarData({ tokenId, avatarStore });
      setAvatar(toSet);

      setLoading(false);
    }
  }, [avatarStore, tokenId]);

  useEffect(() => {
    update();
  }, [update]);

  return {
    loading,
    avatar,
    update,
  };
};

export { useAvatarsStoreData, useAvatarStoreData };