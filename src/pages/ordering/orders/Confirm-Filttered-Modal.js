import React from "react";
import {
  Button,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Text,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { BsFillQuestionOctagonFill } from "react-icons/bs";
import apiClient from "../../../services/apiClient";
import { ToastComponent } from "../../../components/Toast";
import moment from "moment";

export const ConfirmFiltteredModal = ({
  isOpen,
  onClose,
  resultArray,
  openErrorModal,
  closeErrorModal,
  isLoading,
  fetchNotification,
}) => {
  const toast = useToast();

  const syncHandler = () => {
    console.log("Sync Error Data: ", resultArray);
    try {
      // setIsLoading(true)
      const res = apiClient
        .post(
          `Ordering/AddNewOrders`,
          resultArray.map((item) => {
            return {
              transactId: item?.transactId,
              customerName: item?.customerName,
              customerPosition: item?.customerPosition,
              farmType: item?.farmType,
              farmCode: item?.farmCode,
              farmName: item?.farmName,
              orderNo: item?.orderNo,
              batchNo: item?.batchNo.toString(),
              orderDate: moment(item?.orderDate).format("yyyy-MM-DD"),
              dateNeeded: moment(item?.dateNeeded).format("yyyy-MM-DD"),
              timeNeeded: item?.dateNeeded,
              transactionType: item?.transactionType,
              itemCode: item?.itemCode,
              itemDescription: item?.itemDescription,
              uom: item?.uom,
              quantityOrdered: item?.quantityOrdered,
              category: item?.category,
              orderRemarks: item?.orderRemarks,
            };
          })
        )
        .then((res) => {
          ToastComponent("Success", "Orders Synced!", "success", toast);
          // fetchNotification()
          // setIsLoading(false)
          onClose();
          closeErrorModal();
        })
        .catch((err) => {
          ToastComponent("Error", "Orders were not Synced!", "error", toast);
          onClose();
        });
    } catch (error) {}
  };

  return (
    <Modal isOpen={isOpen} onClose={() => {}} size="xl" isCentered>
      <ModalContent>
        <ModalHeader>
          <Flex justifyContent="center">
            <BsFillQuestionOctagonFill fontSize="50px" />
          </Flex>
        </ModalHeader>
        <ModalCloseButton onClick={onClose} />

        <ModalBody>
          <VStack justifyContent="center">
            <Text>Are you sure you want sync these orders?</Text>
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button
            isLoading={isLoading}
            onClick={() => syncHandler()}
            colorScheme="blue"
          >
            Yes
          </Button>
          <Button ml={2} colorScheme="red" onClick={onClose}>
            No
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
