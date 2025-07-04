import React, { useEffect, useRef, useState } from "react";
import {
  Button,
  ButtonGroup,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Text,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { BsQuestionOctagonFill } from "react-icons/bs";
import apiClient from "../../../../services/apiClient";
import { ToastComponent } from "../../../../components/Toast";
import PageScrollReusable from "../../../../components/PageScroll-Reusable";
import moment from "moment";
import { useReactToPrint } from "react-to-print";

// export const StatusConfirmation = ({ isOpen, onClose, statusBody, fetchReceipts }) => {

//     const toast = useToast()
//     const [isLoading, setIsLoading] = useState(false)

//     const submitHandler = () => {
//         let routeLabel;
//         if (statusBody.status) {
//             routeLabel = "InActiveReceipt"
//         } else {
//             routeLabel = "ActivateReceipt"
//         }
//         setIsLoading(true)
//         apiClient.put(`Miscellaneous/${routeLabel}`, { id: statusBody.id }).then((res) => {
//             ToastComponent("Success", "Status updated", "success", toast)
//             fetchReceipts()
//             setIsLoading(false)
//             onClose()
//         }).catch(err => {
//             ToastComponent("Error", err.response.data, "error", toast)
//             setIsLoading(false)
//         })
//     }

//     return (
//         <Modal isOpen={isOpen} onClose={() => { }} size='xl' isCentered>
//             <ModalContent>
//                 <ModalHeader>
//                     <Flex justifyContent='center'>
//                         <BsQuestionOctagonFill fontSize='50px' />
//                     </Flex>
//                 </ModalHeader>
//                 <ModalCloseButton onClick={onClose} />
//                 <ModalBody mb={5}>
//                     <Flex justifyContent='center'>
//                         <Text>{`Are you sure you want to set this receipt ${statusBody?.status ? 'inactive' : 'active'}?`}</Text>
//                     </Flex>
//                 </ModalBody>
//                 <ModalFooter>
//                     <ButtonGroup size='sm'>
//                         <Button colorScheme='blue' onClick={submitHandler} isLoading={isLoading} disabled={isLoading}>Yes</Button>
//                         <Button colorScheme='red' onClick={onClose} isLoading={isLoading} disabled={isLoading}>No</Button>
//                     </ButtonGroup>
//                 </ModalFooter>
//             </ModalContent>
//         </Modal>
//     )
// }

export const ViewModal = ({ isOpen, onClose, statusBody }) => {
  const componentRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const [receiptDetailsData, setReceiptDetailsData] = useState([]);

  const id = statusBody.id;
  const fetchReceiptDetailsApi = async (id) => {
    const res = await apiClient.get(`Miscellaneous/GetAllDetailsFromWarehouseByMReceipt?id=${id}`);
    return res.data;
  };

  const fetchReceiptDetails = () => {
    fetchReceiptDetailsApi(id).then((res) => {
      setReceiptDetailsData(res);
    });
  };

  useEffect(() => {
    fetchReceiptDetails();
  }, [id]);

  console.log(receiptDetailsData);

  return (
    <Modal isOpen={isOpen} onClose={() => {}} size="5xl" isCentered>
      <ModalContent>
        <ModalCloseButton onClick={onClose} />
        <ModalBody mb={5} ref={componentRef}>
          <Flex fontSize="xl" justifyContent="center" mt={5}>
            <Text fontWeight="semibold">Receipt Details</Text>
          </Flex>

          <Flex justifyContent="space-between" mt={2}>
            <VStack alignItems="start" spacing={-1}>
              <Text fontWeight="semibold">Customer Code: {receiptDetailsData[0]?.supplierCode}</Text>
              <Text fontWeight="semibold">Customer Name: {receiptDetailsData[0]?.supplierName}</Text>
              <Text fontWeight="semibold">Details: {receiptDetailsData[0]?.remarks}</Text>
            </VStack>
            <VStack alignItems="start" spacing={-1}>
              <Text fontWeight="semibold">Transaction ID: {receiptDetailsData[0]?.id}</Text>
              <Text fontWeight="semibold">Transaction Date: {moment(receiptDetailsData[0]?.preparedDate).format("yyyy-MM-DD")}</Text>
              <Text fontWeight="semibold">Transact By: {receiptDetailsData[0]?.preparedBy}</Text>
            </VStack>
          </Flex>

          <Flex justifyContent="center" mt={2}>
            <PageScrollReusable minHeight="350px" maxHeight="351px">
              <Table size="sm">
                <Thead bgColor="secondary">
                  <Tr>
                    <Th color="white">Item Code</Th>
                    <Th color="white">Item Description</Th>
                    <Th color="white">Quantity</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {receiptDetailsData?.map((receiptdetails, i) => (
                    <Tr key={i}>
                      <Td>{receiptdetails.itemCode}</Td>
                      <Td>{receiptdetails.itemDescription}</Td>
                      <Td>{receiptdetails.totalQuantity}</Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </PageScrollReusable>
          </Flex>
        </ModalBody>
        <ModalFooter>
          <ButtonGroup size="sm">
            <Button colorScheme="teal" onClick={handlePrint}>
              Print
            </Button>
            <Button colorScheme="gray" onClick={onClose}>
              Close
            </Button>
          </ButtonGroup>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
