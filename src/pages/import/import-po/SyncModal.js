import React, { useRef } from "react";
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
  Input,
  Stack,
  Skeleton,
} from "@chakra-ui/react";
import { RiFileList3Fill } from "react-icons/ri";

import moment from "moment";
import apiClient from "../../../services/apiClient";
import Swal from "sweetalert2";
import { ToastComponent } from "../../../components/Toast";

import PageScroll from "../../../components/PageScroll";
import { decodeUser } from "../../../services/decode-user";
import { MdOutlineSync } from "react-icons/md";

import noRecordsFound from "../../../assets/svg/noRecordsFound.svg";
import { TiArrowSync } from "react-icons/ti";

const currentUser = decodeUser();

const SyncModal = ({ isOpen, onClose, ymirPO, fetchData, setFetchData, fromDate, setFromDate, toDate, setToDate, onErrorSyncModal, errorData, setErrorData }) => {
  const toast = useToast();

  const dateVar = new Date();
  const minDate = moment(dateVar.setDate(dateVar.getDate() - 3)).format("yyyy-MM-DD");

  // console.log("length: ", ymirPO);

  const ymirResultArray = Array.isArray(ymirPO)
    ? ymirPO.flatMap(
        (data) =>
          data?.order?.map((subData) => {
            const prNumber = data?.pr_transaction?.pr_year_number_id?.toString().trim();
            const prNumberPart = prNumber ? prNumber.split("-") : [];
            const poNumber = data?.po_year_number_id?.toString().trim();
            const poNumberPart = poNumber ? poNumber.split("-") : [];

            return {
              pR_Number: prNumberPart.length >= 3 ? Number(prNumberPart[0] + prNumberPart[2]) : null,
              pR_Date: moment(subData?.pr_transaction?.created_at)?.format("YYYY-MM-DD")?.toString().trim(),
              pO_Number: poNumberPart.length >= 3 ? Number(poNumberPart[0] + poNumberPart[2]) : null,
              pO_Date: moment(subData?.po_transaction?.created_at)?.format("YYYY-MM-DD")?.toString().trim(),

              itemCode: subData?.item_code?.toString().trim(),
              itemDescription: subData?.item_name?.toString()?.trim(),

              ordered: subData?.quantity?.toString().trim(),
              delivered: 0,
              billed: 0,
              uom: subData?.uom?.name?.toString().trim(),
              unitPrice: subData?.price?.toString().trim(),
              vendorName: data?.supplier_name?.toString().trim(),
              addedBy: currentUser?.fullName?.toString().trim(),
            };
          })

        // old payload
        // data?.rr_orders?.map((subData) => {
        //   const prNumber = subData?.pr_transaction?.pr_year_number_id?.toString().trim();
        //   const prNumberPart = prNumber ? prNumber.split("-") : [];
        //   const poNumber = subData?.po_transaction?.po_year_number_id?.toString().trim();
        //   const poNumberPart = poNumber ? poNumber.split("-") : [];

        //   return {
        //     pR_Number: prNumberPart.length >= 3 ? Number(prNumberPart[0] + prNumberPart[2]) : null,
        //     pR_Date: moment(subData?.pr_transaction?.created_at)?.format("YYYY-MM-DD")?.toString().trim(),
        //     pO_Number: poNumberPart.length >= 3 ? Number(poNumberPart[0] + poNumberPart[2]) : null,
        //     pO_Date: moment(subData?.po_transaction?.created_at)?.format("YYYY-MM-DD")?.toString().trim(),

        //     itemCode: subData?.order?.item_code?.toString().trim(),
        //     itemDescription: subData?.order?.item_name?.toString()?.trim(),

        //     ordered: subData?.order?.quantity?.toString().trim(),
        //     delivered: subData?.quantity_receive?.toString().trim(),
        //     actualRemaining: subData?.remaining.toString().trim(),
        //     billed: 0,
        //     uom: subData?.order?.uom?.name?.toString().trim(),
        //     unitPrice: subData?.order?.price?.toString().trim(),
        //     // siNumber: subData?.shipment_no?.toString().trim(),
        //     // receiveDate: moment(subData?.delivery_Date)?.format("YYYY-MM-DD")?.toString().trim(),
        //     vendorName: subData?.po_transaction?.supplier_name?.toString().trim(),
        //     addedBy: currentUser?.fullName?.toString().trim(),
        //   };
        // })
      )
    : [];

  console.log("YMIR: ", ymirResultArray);

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
        console.log("YMIR Submit Payload: ", ymirResultArray);
        if (ymirResultArray.length > 0) {
          const hasZeroUnitCost = ymirResultArray.some((data) => data.unitPrice <= 0);

          if (hasZeroUnitCost) {
            ToastComponent("Warning!", "Unit Cost cannot be zero value", "warning", toast);
          } else {
            try {
              setFetchData(true);
              const res = apiClient
                .post("Import/AddNewPOManual", ymirResultArray)
                .then((res) => {
                  ToastComponent("Success!", "Sync purchase orders successfully", "success", toast);
                  setFetchData(false);
                  closeModalHandler();
                  // setIsDisabled(false);
                })
                .catch((err) => {
                  ToastComponent("Error!", "Sync error.", "error", toast);
                  setFetchData(false);
                  setErrorData(err.response.data);
                  if (err.response.data) {
                    // console.log("ErrorData: ", err);
                    onErrorSyncModal();
                  }
                });
            } catch (err) {
              ToastComponent("Error!", "Sync error.", "error", toast);
            }
          }
        } else {
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
    <Modal isOpen={isOpen} onClose={() => {}} isCentered size="6xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <Flex justifyContent="center">
            <Text fontSize="13px" fontWeight="semibold">
              Sync Purchase Orders from YMIR
            </Text>
          </Flex>
        </ModalHeader>
        <ModalCloseButton onClick={() => closeModalHandler()} />

        <PageScroll>
          <ModalBody>
            <Flex width="full" justifyContent="center" alignItems="center" mb={8}>
              <VStack>
                <Text fontSize="13px" fontWeight="semibold">
                  Select Date:{" "}
                </Text>
                <HStack>
                  <Badge fontSize="xs" colorScheme="facebook" variant="solid">
                    From:
                  </Badge>
                  <Input onChange={(date) => setFromDate(date.target.value)} defaultValue={fromDate} min={minDate} type="date" />
                  <Badge fontSize="xs" colorScheme="facebook" variant="solid">
                    To:
                  </Badge>
                  <Input
                    onChange={(date) => setToDate(date.target.value)}
                    defaultValue={moment(new Date()).format("yyyy-MM-DD")}
                    min={fromDate}
                    type="date"
                    // fontSize="11px"
                    // fontWeight="semibold"
                  />
                </HStack>
              </VStack>
            </Flex>

            <Flex p={4}>
              <VStack bg="secondary" alignItems="center" w="100%" p={1} mt={-7}>
                <Text color="white" textAlign="center">
                  LIST OF PURCHASE ORDERS
                </Text>
              </VStack>
            </Flex>

            <Flex p={4}>
              <VStack alignItems="center" w="100%" mt={-8}>
                <PageScroll minHeight="300px" maxHeight="720px" maxWidth="full">
                  {fetchData ? (
                    <Stack width="full">
                      <Skeleton height="20px" />
                      <Skeleton height="20px" />
                      <Skeleton height="20px" />
                      <Skeleton height="20px" />
                      <Skeleton height="20px" />
                      <Skeleton height="20px" />
                      <Skeleton height="20px" />
                      <Skeleton height="20px" />
                      <Skeleton height="20px" />
                      <Skeleton height="20px" />
                      <Skeleton height="20px" />
                      <Skeleton height="20px" />
                    </Stack>
                  ) : (
                    <Table size="sm" width="full" border="none" boxShadow="md" bg="gray.200" variant="striped">
                      <Thead bg="secondary" position="sticky" top={0} zIndex={1}>
                        <Tr>
                          <Th color="white">Line Number</Th>
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
                        {ymirResultArray?.map((d, i) => (
                          <Tr key={i}>
                            <Td color="gray.600">{i + 1}</Td>
                            <Td color="gray.600">{d?.pR_Number}</Td>
                            <Td color="gray.600">{moment(d?.pR_Date).format("yyyy-MM-DD")}</Td>
                            <Td color="gray.600">{d?.pO_Number}</Td>
                            <Td color="gray.600">{moment(d?.pO_Date).format("yyyy-MM-DD")}</Td>
                            <Td color="gray.600">{d?.itemCode}</Td>
                            <Td color="gray.600">{d?.itemDescription}</Td>
                            <Td color="gray.600">
                              {d?.ordered?.toLocaleString(undefined, {
                                minimumFractionDigits: 2,
                                maximumFractionDigi: 2,
                              })}
                            </Td>
                            <Td color="gray.600">
                              {d?.delivered?.toLocaleString(undefined, {
                                minimumFractionDigits: 2,
                                maximumFractionDigi: 2,
                              })}
                            </Td>

                            <Td color="gray.600">{d?.billed}</Td>
                            <Td color="gray.600">{d?.uom}</Td>
                            <Td color="gray.600">
                              {d?.unitPrice?.toLocaleString(undefined, {
                                minimumFractionDigits: 2,
                                maximumFractionDigi: 2,
                              })}
                            </Td>
                            <Td color="gray.600">{d?.vendorName}</Td>
                          </Tr>
                        ))}

                        {!ymirResultArray?.length && (
                          <Tr>
                            <Td colSpan={14} align="center">
                              <Flex width="100%" height="200px" justifyContent="center" alignItems="center">
                                <VStack>
                                  <img src={noRecordsFound} alt="No Records Found" className="norecords-found-table" />
                                  <Text color="black" marginLeft={2}>
                                    No records found.
                                  </Text>
                                </VStack>
                              </Flex>
                            </Td>
                          </Tr>
                        )}
                      </Tbody>
                    </Table>
                  )}
                </PageScroll>
              </VStack>
            </Flex>
          </ModalBody>
        </PageScroll>

        <ModalFooter>
          <Button size="sm" leftIcon={<TiArrowSync fontSize="19px" />} colorScheme="teal" isLoading={fetchData} onClick={() => submitSyncHandler()} isDisabled={!ymirPO?.length}>
            Sync Purchase Orders
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default SyncModal;
