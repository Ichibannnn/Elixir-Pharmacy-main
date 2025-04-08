import React, { useState } from "react";
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Badge,
  VStack,
  HStack,
  useToast,
} from "@chakra-ui/react";
import { TiWarning } from "react-icons/ti";
import moment from "moment";
import PageScrollModalErrorList from "../../../components/PageScrollErrorList";
import PageScrollImportModal from "../../../components/PageScrollImport-Modal";
import { RiFileList3Fill } from "react-icons/ri";
import Swal from "sweetalert2";
import apiClient from "../../../services/apiClient";
import { ToastComponent } from "../../../components/Toast";
import PageScroll from "../../../components/PageScroll";

const ErrorYmirList = ({ isOpen, onClose, errorData, fromDate, setFromDate, toDate, setToDate }) => {
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const availableImportData = errorData?.availableImport?.map((list) => {
    return {
      pR_Number: list.pR_Number,
      pR_Date: moment(list.pR_Date).format("YYYY-MM-DD"),
      pO_Number: list.pO_Number,
      pO_Date: moment(list.pO_Date).format("YYYY-MM-DD"),
      itemCode: list.itemCode,
      itemDescription: list.itemDescription,
      ordered: list.ordered,
      delivered: list.delivered,
      billed: list.billed,
      uom: list.uom,
      unitPrice: list.unitPrice,
      vendorName: list.vendorName,
    };
  });

  const duplicateListData = errorData?.duplicateList?.map((list) => {
    return {
      pR_Number: list.pR_Number,
      pR_Date: moment(list.pR_Date).format("YYYY-MM-DD"),
      pO_Number: list.pO_Number,
      pO_Date: moment(list.pO_Date).format("YYYY-MM-DD"),
      itemCode: list.itemCode,
      itemDescription: list.itemDescription,
      ordered: list.ordered,
      delivered: list.delivered,
      billed: list.billed,
      uom: list.uom,
      unitPrice: list.unitPrice,
      vendorName: list.vendorName,
    };
  });

  const itemcodeNotExistData = errorData?.itemcodeNotExist?.map((list) => {
    return {
      pR_Number: list.pR_Number,
      pR_Date: moment(list.pR_Date).format("YYYY-MM-DD"),
      pO_Number: list.pO_Number,
      pO_Date: moment(list.pO_Date).format("YYYY-MM-DD"),
      item_Code: list.itemCode,
      item_Description: list.itemDescription,
      ordered: list.ordered,
      delivered: list.delivered,
      billed: list.billed,
      uom: list.uom,
      unit_Price: list.unitPrice,
      vendor_Name: list.vendorName,
    };
  });

  const supplierNotExistData = errorData?.supplierNotExist?.map((list) => {
    return {
      pR_Number: list.pR_Number,
      pR_Date: moment(list.pR_Date).format("YYYY-MM-DD"),
      pO_Number: list.pO_Number,
      pO_Date: moment(list.pO_Date).format("YYYY-MM-DD"),
      item_Code: list.itemCode,
      item_Description: list.itemDescription,
      ordered: list.ordered,
      delivered: list.delivered,
      billed: list.billed,
      uom: list.uom,
      unit_Price: list.unitPrice,
      vendor_Name: list.vendorName,
    };
  });

  const uomCodeNotExistData = errorData?.uomCodeNotExist?.map((list) => {
    return {
      pR_Number: list.pR_Number,
      pR_Date: moment(list.pR_Date).format("YYYY-MM-DD"),
      pO_Number: list.pO_Number,
      pO_Date: moment(list.pO_Date).format("YYYY-MM-DD"),
      item_Code: list.itemCode,
      item_Description: list.itemDescription,
      ordered: list.ordered,
      delivered: list.delivered,
      billed: list.billed,
      uom: list.uom,
      unit_Price: list.unitPrice,
      vendor_Name: list.vendorName,
    };
  });

  const available = availableImportData;
  const duplicate = duplicateListData;
  const itemCode = itemcodeNotExistData;
  const supplier = supplierNotExistData;
  const uom = uomCodeNotExistData;

  console.log("Error: ", available);

  const submitSyncHandler = () => {
    Swal.fire({
      title: "Confirmation!",
      text: "Are you sure you want to sync this purchase order list?",
      icon: "info",
      color: "black",
      background: "white",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#CBD1D8",
      confirmButtonText: "Yes",
      heightAuto: false,
      width: "40em",
      customClass: {
        container: "my-swal",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        try {
          setIsLoading(true);
          const res = apiClient
            .post("Import/AddNewPOManual", available)
            .then((res) => {
              ToastComponent("Success!", "Sync purchase orders successfully", "success", toast);
              setIsLoading(false);
              closeModalHandler();
              // setIsDisabled(false);
            })
            .catch((err) => {
              ToastComponent("Error!", "Sync error.", "error", toast);
              setIsLoading(false);
            });
        } catch (err) {
          ToastComponent("Error!", "Sync error.", "error", toast);
        }
      }
    });
  };

  const closeModalHandler = () => {
    setFromDate(moment(new Date()).format("yyyy-MM-DD"));
    setToDate(moment(new Date()).format("yyyy-MM-DD"));
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={() => closeModalHandler()} isCentered size="6xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <Flex justifyContent="center">
            <Text color="danger">File was not imported due to the following reasons</Text>
          </Flex>
        </ModalHeader>
        <ModalCloseButton onClick={onClose} />

        <PageScrollImportModal>
          <ModalBody>
            <Accordion allowToggle>
              {/* FILTERED ORDERS */}
              {available?.length > 0 ? (
                <AccordionItem bgColor="gray.200">
                  <Flex>
                    <AccordionButton color="white" fontWeight="semibold">
                      <Box flex="1" textAlign="center" color="secondary" fontWeight="semibold">
                        Available for syncing <Badge color="green">{available?.length}</Badge>
                      </Box>
                      <AccordionIcon color="secondary" />
                    </AccordionButton>
                  </Flex>

                  <AccordionPanel pb={4}>
                    <PageScroll minHeight="500px" maxHeight="501px">
                      {available ? (
                        <Table variant="striped" size="sm" bg="form">
                          <Thead bgColor="gray.600">
                            <Tr>
                              <Th color="white">PR Number</Th>
                              <Th color="white">PR Date</Th>
                              <Th color="white">PO Number</Th>
                              <Th color="white">PO Date</Th>
                              <Th color="white">Item Code</Th>
                              <Th color="white">Item Description</Th>
                              <Th color="white">Qty Ordered</Th>
                              <Th color="white">Qty Delivered</Th>
                              <Th color="white">Qty Billed</Th>
                              <Th color="white">UOM</Th>
                              <Th color="white">Supplier Name</Th>
                            </Tr>
                          </Thead>

                          <Tbody>
                            {available?.map((d, i) => (
                              <Tr key={i}>
                                <Td color="gray.600">{d?.pR_Number ? `${d.pR_Number.toString().substring(0, 4)}-PR-${d.pR_Number.toString().substring(4)}` : ""}</Td>
                                <Td color="gray.600">{moment(d?.pR_Date).format("yyyy-MM-DD")}</Td>
                                <Td color="gray.600"> {d?.pO_Number ? `${d.pO_Number.toString().substring(0, 4)}-PO-${d.pO_Number.toString().substring(4)}` : ""}</Td>
                                <Td color="gray.600">{moment(d?.pO_Date).format("yyyy-MM-DD")}</Td>
                                <Td color="gray.600">{d?.itemCode}</Td>
                                <Td color="gray.600">{d?.itemDescription}</Td>
                                <Td color="gray.600">{d?.ordered}</Td>
                                <Td color="gray.600">{d?.delivered}</Td>
                                <Td color="gray.600">{d?.billed}</Td>
                                <Td color="gray.600">{d?.uom}</Td>
                                <Td color="gray.600">{d?.vendorName}</Td>
                              </Tr>
                            ))}
                          </Tbody>
                        </Table>
                      ) : (
                        <Flex justifyContent="center" mt="30px">
                          <VStack>
                            <RiFileList3Fill fontSize="200px" />
                            <Text color="white">There are no duplicated lists on this file</Text>
                          </VStack>
                        </Flex>
                      )}
                    </PageScroll>
                    {available ? (
                      <Flex justifyContent="end">
                        <Button onClick={() => submitSyncHandler()} size="sm" _hover={{ bgColor: "accent", color: "white" }} colorScheme="teal" isLoading={isLoading}>
                          Sync
                        </Button>
                      </Flex>
                    ) : (
                      ""
                    )}
                  </AccordionPanel>
                </AccordionItem>
              ) : (
                ""
              )}

              {/* Duplicated */}
              {duplicate?.length > 0 ? (
                <AccordionItem bgColor="gray.200">
                  <Flex>
                    <AccordionButton color="white" fontWeight="semibold">
                      <Box flex="1" textAlign="center" color="secondary" fontWeight="semibold">
                        Duplicated Lists <Badge color="danger">{duplicate?.length}</Badge>
                      </Box>
                      <AccordionIcon color="secondary" />
                    </AccordionButton>
                  </Flex>

                  <AccordionPanel pb={4}>
                    <PageScrollModalErrorList>
                      {duplicate?.length > 0 ? (
                        <Table variant="striped" size="sm">
                          <Thead bgColor="secondary">
                            <Tr>
                              {/* <Th color='white'>ID</Th> */}
                              <Th color="white">PR Number</Th>
                              <Th color="white">PR Date</Th>
                              <Th color="white">PO Number</Th>
                              <Th color="white">PO Date</Th>
                              <Th color="white">Item Code</Th>
                              <Th color="white">Item Description</Th>
                              <Th color="white">Ordered</Th>
                              <Th color="white">Delivered</Th>
                              <Th color="white">Billed</Th>
                              <Th color="white">UOM</Th>
                              <Th color="white">Unit Price</Th>
                              <Th color="white">Vendor Name</Th>
                            </Tr>
                          </Thead>

                          <Tbody>
                            {duplicate?.map((d, i) => (
                              <Tr key={i}>
                                <Td>{d?.pR_Number}</Td>
                                <Td>{d?.pR_Date}</Td>
                                <Td>{d?.pO_Number}</Td>
                                <Td>{d?.pO_Date}</Td>
                                <Td>{d?.itemCode}</Td>
                                <Td>{d?.itemDescription}</Td>
                                <Td>{d?.ordered}</Td>
                                <Td>{d?.delivered}</Td>
                                <Td>{d?.billed}</Td>
                                <Td>{d?.uom}</Td>
                                <Td>{d?.unit_Price}</Td>
                                <Td>{d?.vendor_Name}</Td>
                              </Tr>
                            ))}
                          </Tbody>
                        </Table>
                      ) : (
                        <Flex justifyContent="center" mt="30px">
                          <VStack>
                            <RiFileList3Fill fontSize="200px" />
                            <Text color="white">There are no duplicated lists on this file</Text>
                          </VStack>
                        </Flex>
                      )}
                    </PageScrollModalErrorList>
                  </AccordionPanel>
                </AccordionItem>
              ) : (
                ""
              )}

              {/* Item Code */}
              {itemCode?.length > 0 ? (
                <AccordionItem bgColor="gray.200">
                  <Flex>
                    <AccordionButton color="white" fontWeight="semibold">
                      <Box flex="1" textAlign="center" color="secondary" fontWeight="semibold">
                        Item Code does not exist <Badge color="danger">{itemCode?.length}</Badge>
                      </Box>
                      <AccordionIcon color="secondary" />
                    </AccordionButton>
                  </Flex>

                  <AccordionPanel pb={4}>
                    <PageScrollModalErrorList>
                      {itemCode?.length > 0 ? (
                        <Table variant="striped" size="sm">
                          <Thead bgColor="secondary">
                            <Tr>
                              {/* <Th color='white'>ID</Th> */}
                              <Th color="white">PR Number</Th>
                              <Th color="white">PR Date</Th>
                              <Th color="white">PO Number</Th>
                              <Th color="white">PO Date</Th>
                              <Th color="white">Item Code</Th>
                              <Th color="white">Item Description</Th>
                              <Th color="white">Ordered</Th>
                              <Th color="white">Delivered</Th>
                              <Th color="white">Billed</Th>
                              <Th color="white">UOM</Th>
                              <Th color="white">Unit Price</Th>
                              <Th color="white">Vendor Name</Th>
                            </Tr>
                          </Thead>

                          <Tbody>
                            {itemCode?.map((ne, i) => (
                              <Tr key={i}>
                                {/* <Td>{ }</Td> */}
                                <Td>{ne?.pR_Number}</Td>
                                <Td>{ne?.pR_Date}</Td>
                                <Td>{ne?.pO_Number}</Td>
                                <Td>{ne?.pO_Date}</Td>
                                <Td>{ne?.item_Code}</Td>
                                <Td>{ne?.item_Description}</Td>
                                <Td>{ne?.ordered}</Td>
                                <Td>{ne?.delivered}</Td>
                                <Td>{ne?.billed}</Td>
                                <Td>{ne?.uom}</Td>
                                <Td>{ne?.unit_Price}</Td>
                                <Td>{ne?.vendor_Name}</Td>
                              </Tr>
                            ))}
                          </Tbody>
                        </Table>
                      ) : (
                        <Flex justifyContent="center" mt="30px">
                          <VStack>
                            <RiFileList3Fill fontSize="200px" />
                            <Text color="white">There are no lists with unregistered item code.</Text>
                          </VStack>
                        </Flex>
                      )}
                    </PageScrollModalErrorList>
                  </AccordionPanel>
                </AccordionItem>
              ) : (
                ""
              )}

              {/* Supplier */}
              {supplier?.length > 0 ? (
                <AccordionItem bgColor="gray.200">
                  <Flex>
                    <AccordionButton color="white" fontWeight="semibold">
                      <Box flex="1" textAlign="center" color="secondary" fontWeight="semibold">
                        Supplier does not exist <Badge color="danger">{supplier?.length}</Badge>
                      </Box>
                      <AccordionIcon color="secondary" />
                    </AccordionButton>
                  </Flex>

                  <AccordionPanel pb={4}>
                    <PageScrollModalErrorList>
                      {supplier?.length > 0 ? (
                        <Table variant="striped" size="sm">
                          <Thead bgColor="secondary">
                            <Tr>
                              {/* <Th color='white'>ID</Th> */}
                              <Th color="white">PR Number</Th>
                              <Th color="white">PR Date</Th>
                              <Th color="white">PO Number</Th>
                              <Th color="white">PO Date</Th>
                              <Th color="white">Item Code</Th>
                              <Th color="white">Item Description</Th>
                              <Th color="white">Ordered</Th>
                              <Th color="white">Delivered</Th>
                              <Th color="white">Billed</Th>
                              <Th color="white">UOM</Th>
                              <Th color="white">Unit Price</Th>
                              <Th color="white">Vendor Name</Th>
                            </Tr>
                          </Thead>

                          <Tbody>
                            {supplier?.map((ne, i) => (
                              <Tr key={i}>
                                {/* <Td>{ }</Td> */}
                                <Td>{ne?.pR_Number}</Td>
                                <Td>{ne?.pR_Date}</Td>
                                <Td>{ne?.pO_Number}</Td>
                                <Td>{ne?.pO_Date}</Td>
                                <Td>{ne?.item_Code}</Td>
                                <Td>{ne?.item_Description}</Td>
                                <Td>{ne?.ordered}</Td>
                                <Td>{ne?.delivered}</Td>
                                <Td>{ne?.billed}</Td>
                                <Td>{ne?.uom}</Td>
                                <Td>{ne?.unit_Price}</Td>
                                <Td>{ne?.vendor_Name}</Td>
                              </Tr>
                            ))}
                          </Tbody>
                        </Table>
                      ) : (
                        <Flex justifyContent="center" mt="30px">
                          <VStack>
                            <RiFileList3Fill fontSize="200px" />
                            <Text color="white">There are no lists with unregistered suppliers.</Text>
                          </VStack>
                        </Flex>
                      )}
                    </PageScrollModalErrorList>
                  </AccordionPanel>
                </AccordionItem>
              ) : (
                ""
              )}

              {/* UOM */}
              {uom?.length > 0 ? (
                <AccordionItem bgColor="gray.200">
                  <Flex>
                    <AccordionButton color="white" fontWeight="semibold">
                      <Box flex="1" textAlign="center" color="secondary" fontWeight="semibold">
                        UOM does not exist <Badge color="danger">{uom?.length}</Badge>
                      </Box>
                      <AccordionIcon color="secondary" />
                    </AccordionButton>
                  </Flex>

                  <AccordionPanel pb={4}>
                    <PageScrollModalErrorList>
                      {uom?.length > 0 ? (
                        <Table variant="striped" size="sm">
                          <Thead bgColor="secondary">
                            <Tr>
                              {/* <Th color='white'>ID</Th> */}
                              <Th color="white">PR Number</Th>
                              <Th color="white">PR Date</Th>
                              <Th color="white">PO Number</Th>
                              <Th color="white">PO Date</Th>
                              <Th color="white">Item Code</Th>
                              <Th color="white">Item Description</Th>
                              <Th color="white">Ordered</Th>
                              <Th color="white">Delivered</Th>
                              <Th color="white">Billed</Th>
                              <Th color="white">UOM</Th>
                              <Th color="white">Unit Price</Th>
                              <Th color="white">Vendor Name</Th>
                            </Tr>
                          </Thead>

                          <Tbody>
                            {uom?.map((ne, i) => (
                              <Tr key={i}>
                                {/* <Td>{ }</Td> */}
                                <Td>{ne?.pR_Number}</Td>
                                <Td>{ne?.pR_Date}</Td>
                                <Td>{ne?.pO_Number}</Td>
                                <Td>{ne?.pO_Date}</Td>
                                <Td>{ne?.item_Code}</Td>
                                <Td>{ne?.item_Description}</Td>
                                <Td>{ne?.ordered}</Td>
                                <Td>{ne?.delivered}</Td>
                                <Td>{ne?.billed}</Td>
                                <Td>{ne?.uom}</Td>
                                <Td>{ne?.unit_Price}</Td>
                                <Td>{ne?.vendor_Name}</Td>
                              </Tr>
                            ))}
                          </Tbody>
                        </Table>
                      ) : (
                        <Flex justifyContent="center" mt="30px">
                          <VStack>
                            <RiFileList3Fill fontSize="200px" />
                            <Text color="white">There are no lists with unregistered UOM.</Text>
                          </VStack>
                        </Flex>
                      )}
                    </PageScrollModalErrorList>
                  </AccordionPanel>
                </AccordionItem>
              ) : (
                ""
              )}
            </Accordion>

            <HStack mt={20} textAlign="center" color="secondary" fontWeight="semibold">
              <TiWarning color="red" />
              <Text>Disclaimer: There were no PO imported.</Text>
            </HStack>
          </ModalBody>
        </PageScrollImportModal>

        <ModalFooter>
          <Button mr={3} onClick={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ErrorYmirList;
