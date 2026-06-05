import React, { useState, useEffect } from "react";
import { Button, Flex, HStack, Input, InputGroup, InputLeftElement, InputRightElement } from "@chakra-ui/react";
import { FcSearch } from "react-icons/fc";
import { MdOutlineClose } from "react-icons/md";
import { SiCommonworkflowlanguage } from "react-icons/si";

import apiClient from "../../services/apiClient";
import { WarehouseContext } from "../../context/WarehouseContext";

import ItemNotFound from "./rm-receiving-page/Item-Not-Found";
import ScannedModalSubmit from "./rm-receiving-page/Scanned-Modal-Submit";
import ScannedModal from "./rm-receiving-page/Scanned-Modal";
import ProvideItemCode from "./rm-receiving-page/Provide-Item-Code";

const fetchItemCodeDataApi = async (code) => {
  const res = await apiClient.get(`Warehouse/ScanBarcode/${code}`);
  return res.data;
};

const RmReceivingPage = () => {
  const [code, setCode] = useState("");
  const [displayCode, setDisplayCode] = useState("");

  const [itemCodeData, setItemCodeData] = useState([]);

  const [receivingDate, setReceivingDate] = useState("");
  const [lotCategory, setLotCategory] = useState("");
  const [actualGood, setActualGood] = useState(0);

  const [quantity, setQuantity] = useState("");
  const [remarks, setRemarks] = useState("");

  const [sumQuantity, setSumQuantity] = useState(0);
  const [submitRejectData, setSubmitRejectData] = useState([]);
  const [receivingId, setReceivingId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [buttonChanger, setButtonChanger] = useState(false);

  const fetchItemCodeData = () => {
    fetchItemCodeDataApi(code).then((res) => {
      setIsLoading(false);
      setItemCodeData(res);
    });
  };

  useEffect(() => {
    if (code) {
      fetchItemCodeData();
    }

    return () => {
      setItemCodeData([]);
    };
  }, [code]);

  const itemHandler = (data) => {
    setDisplayCode(data);
  };

  const scanHandler = () => {
    setCode(displayCode);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      scanHandler();
    }
  };

  const clearHandler = () => {
    setDisplayCode("");
    setCode("");
    fetchItemCodeData();
  };

  return (
    <WarehouseContext.Provider value={{ setQuantity, setRemarks, setSumQuantity, setSubmitRejectData, setReceivingId, setButtonChanger, setDisplayCode, setCode }}>
      <Flex p={5} w="full" flexDirection="column">
        <Flex mb={2} justifyContent="start">
          <Flex>
            <InputGroup>
              <InputRightElement pointerEvents="none" children={<FcSearch color="gray.300" />} />
              <Input value={displayCode} placeholder="Item Code" onChange={(e) => itemHandler(e.target.value)} onKeyDown={handleKeyDown} />
            </InputGroup>
            <HStack ml={2} spacing={1}>
              <Button onClick={() => scanHandler()} bgColor="secondary" color="white" _hover={{ bgColor: "accent" }}>
                Search
              </Button>
              <Button onClick={() => clearHandler()} bgColor="secondary" color="white" _hover={{ bgColor: "accent" }}>
                Clear
              </Button>
            </HStack>
          </Flex>
        </Flex>

        {/* Data Display when Scanned or item Code provided */}
        {buttonChanger === true ? (
          ""
        ) : !code ? (
          <ProvideItemCode />
        ) : code != itemCodeData.itemCode ? (
          <ItemNotFound />
        ) : (
          <ScannedModal
            itemCodeData={itemCodeData}
            setReceivingDate={setReceivingDate}
            receivingDate={receivingDate}
            setLotCategory={setLotCategory}
            lotCategory={lotCategory}
            setActualGood={setActualGood}
            quantity={quantity}
            remarks={remarks}
            sumQuantity={sumQuantity}
            actualGood={actualGood}
            receivingId={receivingId}
            buttonChanger={buttonChanger}
          />
        )}

        {/* Save Button */}
        {!lotCategory || !receivingDate ? (
          ""
        ) : (
          <ScannedModalSubmit
            code={code}
            receivingDate={receivingDate}
            lotCategory={lotCategory}
            actualGood={actualGood}
            sumQuantity={sumQuantity}
            submitRejectData={submitRejectData}
            itemCodeData={itemCodeData}
            fetchItemCodeData={fetchItemCodeData}
            receivingId={receivingId}
            buttonChanger={buttonChanger}
          />
        )}
      </Flex>
    </WarehouseContext.Provider>
  );
};

export default RmReceivingPage;
