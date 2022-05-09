import {
    Stack,
    Heading,
    Text,
    Table,
    Thead,
    Tr,
    Th,
    Td,
    Tbody,
    Button,
    Tag,
    useToast
  } from "@chakra-ui/react";
import { useWeb3React } from "@web3-react/core";
import RequestAccess from "../../components/request-access";
import AvatarCard from "../../components/avatar-card";
import { useAvatarStoreData } from "../../hooks/useAvatarsStoreData";
import { useParams } from "react-router-dom";
import Loading from "../../components/loading";
import { useState } from "react";
import useAvatarStore from "../../hooks/useAvatarStore";
  
  const Avatar = () => {
    const { active, account, library } = useWeb3React();
    const { tokenId } = useParams();
    const { loading, avatar, update } = useAvatarStoreData(tokenId);
    const avatarStore = useAvatarStore();
    const toast = useToast();
    const [transfering, setTransfering] = useState(false);

    const transfer = () => {
        setTransfering(true);
    
        const address = prompt("Ingresa la dirección: ");
    
        const isAddress = library.utils.isAddress(address);
    
        if (!isAddress) {
          toast({
            title: "Dirección inválida",
            description: "La dirección no es una dirección de Ethereum",
            status: "error",
          });
          setTransfering(false);
        } else {
            avatarStore.methods
            .safeTransferFrom(avatar.owner, address, avatar.tokenId)
            .send({
              from: account,
            })
            .on("error", () => {
              setTransfering(false);
            })
            .on("transactionHash", (txHash) => {
              toast({
                title: "Transacción enviada",
                description: txHash,
                status: "info",
              });
            })
            .on("receipt", () => {
              setTransfering(false);
              toast({
                title: "Transacción confirmada",
                description: `El Avatar ahora pertenece a ${address}`,
                status: "success",
              });
              update();
            });
        }
      };
  
    if (!active) return <RequestAccess />;
  
    if (loading) return <Loading />;
  
    return (
      <Stack
        spacing={{ base: 8, md: 10 }}
        py={{ base: 5 }}
        direction={{ base: "column", md: "row" }}
      >
        <Stack>
          <AvatarCard
            mx={{
              base: "auto",
              md: 0,
            }}
            name={avatar.name}
            image={avatar.image}
          />
          <Button onClick={transfer} disabled={account !== avatar.owner} colorScheme="green" isLoading={transfering}>
            {account !== avatar.owner ? "No eres el dueño" : "Transferir"}
          </Button>
        </Stack>
        <Stack width="100%" spacing={5}>
          <Heading>{avatar.name}</Heading>
          <Text fontSize="xl">{avatar.description}</Text>
          <Text fontWeight={600}>
            DNA:
            <Tag ml={2} colorScheme="green">
              {avatar.dna}
            </Tag>
          </Text>
          <Text fontWeight={600}>
            Owner:
            <Tag ml={2} colorScheme="green">
              {avatar.owner}
            </Tag>
          </Text>
          <Table size="sm" variant="simple">
            <Thead>
              <Tr>
                <Th>Atributo</Th>
                <Th>Valor</Th>
              </Tr>
            </Thead>
            <Tbody>
              {Object.entries(avatar.attributes).map(([key, value]) => (
                <Tr key={key}>
                  <Td>{key}</Td>
                  <Td>
                    <Tag>{value}</Tag>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Stack>
      </Stack>
    );
  };
  
  export default Avatar;