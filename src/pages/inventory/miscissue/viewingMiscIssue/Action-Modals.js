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
  HStack,
} from "@chakra-ui/react";
import { BsQuestionOctagonFill } from "react-icons/bs";
import apiClient from "../../../../services/apiClient";
import { ToastComponent } from "../../../../components/Toast";
import PageScrollReusable from "../../../../components/PageScroll-Reusable";
import moment from "moment";
import { useReactToPrint } from "react-to-print";

// export const StatusConfirmation = ({ isOpen, onClose, statusBody, fetchIssues }) => {

//     const toast = useToast()
//     const [isLoading, setIsLoading] = useState(false)

//     const submitHandler = () => {
//         let routeLabel;
//         if (statusBody.status) {
//             routeLabel = "InActiveIssue"
//         }
//         // else {
//         //     routeLabel = "ActivateIssue"
//         // }
//         setIsLoading(true)
//         apiClient.put(`Miscellaneous/${routeLabel}`, { id: statusBody.id }).then((res) => {
//             ToastComponent("Success", "Status updated", "success", toast)
//             fetchIssues()
//             setIsLoading(false)
//             onClose()
//         }).catch(err => {
//             setIsLoading(false)
//             console.log(err);
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
//                         <Text>{`Are you sure you want to set this issue ${statusBody?.status ? 'inactive' : 'active'}?`}</Text>
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

  console.log(statusBody);

  const [issuesDetailsData, setIssuesDetailsData] = useState([]);

  const id = statusBody.id;
  const fetchIssuesDetailsApi = async (id) => {
    const res = await apiClient.get(`Miscellaneous/GetAllDetailsInMiscellaneousIssue?id=${id}`);
    return res.data;
  };

  const fetchIssuesDetails = () => {
    fetchIssuesDetailsApi(id).then((res) => {
      setIssuesDetailsData(res);
    });
  };

  useEffect(() => {
    fetchIssuesDetails();
  }, [id]);

  return (
    <Modal isOpen={isOpen} onClose={() => {}} size="5xl" isCentered>
      <ModalContent>
        <ModalCloseButton onClick={onClose} />
        <ModalBody mb={5} ref={componentRef}>
          <Flex fontSize="xl" justifyContent="center" mt={5}>
            <Text fontWeight="semibold">Issue Details</Text>
          </Flex>
          <Flex justifyContent="space-between">
            <VStack alignItems="start" spacing={-1}>
              <Text fontWeight="semibold">Customer Code: {issuesDetailsData[0]?.customerCode}</Text>
              <Text fontWeight="semibold">Customer Name: {issuesDetailsData[0]?.customer}</Text>
              <Text fontWeight="semibold">Details: {issuesDetailsData[0]?.remarks}</Text>
            </VStack>
            <VStack alignItems="start" spacing={-1}>
              <Text fontWeight="semibold">Transaction ID: {issuesDetailsData[0]?.issuePKey}</Text>
              <Text fontWeight="semibold">Transaction Date: {moment(issuesDetailsData[0]?.preparedDate).format("yyyy-MM-DD")}</Text>
              <Text fontWeight="semibold">Transact By: {issuesDetailsData[0]?.preparedBy}</Text>
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
                  {issuesDetailsData?.map((receiptdetails, i) => (
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
