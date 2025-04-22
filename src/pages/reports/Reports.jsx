import React, { useRef, useState } from "react";
import moment from "moment";
import * as XLSX from "xlsx";
import {
  Badge,
  Box,
  Button,
  ButtonGroup,
  Flex,
  HStack,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalOverlay,
  Select,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useDisclosure,
} from "@chakra-ui/react";
import { MiscellaneousIssueHistory } from "./reportsdropdown/Miscellaneous-Issue-History";
import { MiscellaneousReceiptHistory } from "./reportsdropdown/Miscellaneous-Receipt-History";
import { MoveOrderTransactionHistory } from "./reportsdropdown/Move-Order-Transaction-History";
import { QCReceivingHistory } from "./reportsdropdown/QC-Receiving-History";
import { TransformationReportHistory } from "./reportsdropdown/Transformation-Report-History";
import { WarehouseReceivingHistory } from "./reportsdropdown/Warehouse-Receiving-History";
import { TransactedMoveOrders } from "./reportsdropdown/Transacted-Move-Orders";
import { CancelledOrders } from "./reportsdropdown/Cancelled-Orders";
import { NearlyExpiryReports } from "./reportsdropdown/Nearly-Expiry-Reports";
import { InventoryMovement } from "./reportsdropdown/Inventory-Movement";
import { TransformationReportHistoryTesting } from "../../sandbox/Transformation-Report-Testing";
import { TransformationReportHistoryTestingTwo } from "../../sandbox/Transformation-Report-TestingTwo";
import { useReactToPrint } from "react-to-print";
import PageScrollReusable from "../../components/PageScroll-Reusable";
import { ConsolidatedReportsFinance } from "./reportsdropdown/Consolidated-Finance";
import { ConsolidatedReportsAudit } from "./reportsdropdown/Consolidated-Audit";
import apiClient from "../../services/apiClient";

const Reports = () => {
  const [dateFrom, setDateFrom] = useState(moment(new Date()).format("yyyy-MM-DD"));
  const [dateTo, setDateTo] = useState(moment(new Date()).format("yyyy-MM-DD"));
  const [expiryDays, setExpiryDays] = useState(30);

  const [sample, setSample] = useState("");
  const [sheetData, setSheetData] = useState([]);

  const [isLoading, setIsLoading] = useState(false);
  const [printData, setPrintData] = useState("");

  const { isOpen: isPrintMiscReceipt, onOpen: openPrinMiscReceipt, onClose: closePrintMiscReceipt } = useDisclosure();
  const { isOpen: isPrintMiscIssue, onOpen: openPrinMiscIssue, onClose: closePrintMiscIssue } = useDisclosure();

  const navigationHandler = (data) => {
    if (data) {
      setSample(data);
    } else {
      setSample("");
      setSheetData([]);
    }
  };

  const handleExport = async () => {
    if (sample === 9) {
      setIsLoading(true);
      try {
        const response = await apiClient.get("Report/ExportConsolidateFinance", {
          params: {
            DateFrom: dateFrom,
            DateTo: dateTo,
            // Search: search,
          },
          responseType: "blob",
        });

        console.log("Response: ", response);

        const url = window.URL.createObjectURL(new Blob([response.data]), { type: response.headers["content-type"] });
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "Consolidated_Finance_Report.xlsx");
        document.body.appendChild(link);
        link.click();
        link.remove();
        setIsLoading(false);
      } catch (error) {
        console.log("Error", error);
      }
    } else if (sample === 10) {
      setIsLoading(true);
      try {
        const response = await apiClient.get("Report/ConsolidateAuditExport", {
          params: {
            DateFrom: dateFrom,
            DateTo: dateTo,
            // Search: search,
          },
          responseType: "blob",
        });

        console.log("Response: ", response);

        const url = window.URL.createObjectURL(new Blob([response.data]), { type: response.headers["content-type"] });
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "Consolidated_Audit_Report.xlsx");
        document.body.appendChild(link);
        link.click();
        link.remove();
        setIsLoading(false);
      } catch (error) {
        console.log("Error", error);
      }
    } else {
      var workbook = XLSX.utils.book_new(),
        worksheet = XLSX.utils.json_to_sheet(sheetData);

      XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

      XLSX.writeFile(workbook, "Elixir_Reports_ExportFile.xlsx");
    }
  };

  const printMiscTransaction = () => {
    if (sample === 5) {
      setIsLoading(true);
      setPrintData(sheetData);
      openPrinMiscIssue();
    } else if (sample === 6) {
      setIsLoading(true);
      setPrintData(sheetData);
      openPrinMiscReceipt();
    } else {
    }
  };

  console.log("PrintData: ", printData);

  const minimumDateForInventoryMovement = "2022-01-01";

  return (
    <>
      <Flex w="full" p={5}>
        <Flex w="full" justifyContent="start" flexDirection="column">
          <Flex w="full" justifyContent="space-between">
            {/* Dropdown value  */}
            <Flex justifyContent="start" flexDirection="column">
              <Flex>
                <Badge>Report Name</Badge>
              </Flex>
              <HStack>
                <Select onChange={(e) => navigationHandler(Number(e.target.value))} placeholder=" " bgColor="#fff8dc" w="full">
                  <option value={1}>QC Receiving History</option>
                  <option value={2}>Warehouse Receiving History</option>
                  <option value={3}>Transformation Report History</option>
                  <option value={4}>Move Order Transaction History</option>
                  <option value={5}>Miscellaneous Issue History</option>
                  <option value={6}>Miscellaneous Receipt History</option>
                  <option value={7}>Transacted Move Orders</option>
                  <option value={8}>Cancelled Orders</option>
                  <option value={9}>Consolidated Report (Finance)</option>
                  <option value={10}>Consolidated Report (Audit)</option>
                  <option value={11}>Inventory Movement</option>
                  <option value={12}>Nearly Expiry Report</option>
                </Select>

                <Button onClick={handleExport} disabled={sheetData?.length === 0 || !sample} isLoading={isLoading} size="sm" colorScheme="teal">
                  Export
                </Button>

                {(sample === 5 || sample === 6) && (
                  <>
                    <Button onClick={printMiscTransaction} isLoading={isLoading} isDisabled={sheetData?.length === 0 || !sample} size="sm" colorScheme="green">
                      Print
                    </Button>
                  </>
                )}
              </HStack>
            </Flex>

            {/* Viewing Condition  */}
            <Flex justifyContent="start">
              {sample < 12 ? (
                <Flex justifyContent="start" flexDirection="row">
                  {/* <Flex flexDirection='column' ml={1}>
                                            <Flex>
                                                <Badge>Status</Badge>
                                            </Flex>
                                            <Select
                                                onChange={(e) => setExpiryDays(e.target.value)}
                                                bgColor='#fff8dc' w='full'
                                            >
                                                <option value={30}>For Transaction</option>
                                                <option value={60}>Transacted</option>
                                            </Select>
                                        </Flex> */}
                  {sample != 11 && (
                    <Flex flexDirection="column" ml={1}>
                      <Flex>
                        <Badge>Date from</Badge>
                      </Flex>
                      <Input bgColor="#fff8dc" type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
                    </Flex>
                  )}
                  <Flex flexDirection="column" ml={1}>
                    <Flex>
                      <Badge>{sample === 11 ? "Rollback Date" : "Date to"}</Badge>
                    </Flex>
                    <Input
                      bgColor="#fff8dc"
                      type="date"
                      value={dateTo}
                      onChange={(e) => setDateTo(e.target.value)}
                      min={sample === 9 ? minimumDateForInventoryMovement : undefined}
                    />
                  </Flex>
                </Flex>
              ) : (
                sample === 12 && (
                  <Flex justifyContent="start" flexDirection="column" ml={1}>
                    <Flex>
                      <Badge>Expiry Days</Badge>
                    </Flex>
                    <Select onChange={(e) => setExpiryDays(e.target.value)} bgColor="#fff8dc" w="full">
                      <option value={30}>30</option>
                      <option value={60}>60</option>
                      <option value={90}>90</option>
                    </Select>
                  </Flex>
                )
              )}
            </Flex>
          </Flex>

          {/* Rendering Reports Components  */}
          <Flex w="full" mt={5} justifyContent="center">
            {sample === 1 ? (
              <QCReceivingHistory dateFrom={dateFrom} dateTo={dateTo} sample={sample} setSheetData={setSheetData} />
            ) : sample === 2 ? (
              <WarehouseReceivingHistory dateFrom={dateFrom} dateTo={dateTo} sample={sample} setSheetData={setSheetData} />
            ) : sample === 3 ? (
              <TransformationReportHistory dateFrom={dateFrom} dateTo={dateTo} sample={sample} setSheetData={setSheetData} />
            ) : // <TransformationReportHistoryTestingTwo dateFrom={dateFrom} dateTo={dateTo} sample={sample} setSheetData={setSheetData} />
            sample === 4 ? (
              <MoveOrderTransactionHistory dateFrom={dateFrom} dateTo={dateTo} sample={sample} setSheetData={setSheetData} />
            ) : sample === 5 ? (
              <MiscellaneousIssueHistory dateFrom={dateFrom} dateTo={dateTo} sample={sample} setSheetData={setSheetData} />
            ) : sample === 6 ? (
              <MiscellaneousReceiptHistory dateFrom={dateFrom} dateTo={dateTo} sample={sample} setSheetData={setSheetData} />
            ) : sample === 7 ? (
              <TransactedMoveOrders dateFrom={dateFrom} dateTo={dateTo} sample={sample} setSheetData={setSheetData} />
            ) : sample === 8 ? (
              <CancelledOrders sample={sample} dateFrom={dateFrom} dateTo={dateTo} setSheetData={setSheetData} />
            ) : sample === 9 ? (
              <ConsolidatedReportsFinance dateFrom={dateFrom} dateTo={dateTo} sample={sample} setSheetData={setSheetData} />
            ) : sample === 10 ? (
              <ConsolidatedReportsAudit dateFrom={dateFrom} dateTo={dateTo} sample={sample} setSheetData={setSheetData} />
            ) : sample === 11 ? (
              <InventoryMovement dateFrom={dateFrom} dateTo={dateTo} sample={sample} setSheetData={setSheetData} />
            ) : sample === 12 ? (
              <NearlyExpiryReports sample={sample} expiryDays={expiryDays} setSheetData={setSheetData} />
            ) : (
              ""
            )}

            {isPrintMiscReceipt && (
              <PrintMiscReceiptModal
                isOpen={isPrintMiscReceipt}
                onClose={closePrintMiscReceipt}
                printData={printData}
                setPrintData={setPrintData}
                dateFrom={dateFrom}
                dateTo={dateTo}
                setIsLoading={setIsLoading}
              />
            )}

            {isPrintMiscIssue && (
              <PrintMiscIssueModal
                isOpen={openPrinMiscIssue}
                onClose={closePrintMiscIssue}
                printData={printData}
                setPrintData={setPrintData}
                dateFrom={dateFrom}
                dateTo={dateTo}
                setIsLoading={setIsLoading}
              />
            )}
          </Flex>
        </Flex>
      </Flex>
    </>
  );
};

export default Reports;

const PrintMiscReceiptModal = ({ isOpen, onClose, printData, setPrintData, dateFrom, dateTo, setIsLoading }) => {
  const componentRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const closeHandler = () => {
    setIsLoading(false);
    setPrintData("");
    onClose();
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={() => closeHandler()} isCentered size="6xl">
        <ModalOverlay />
        <ModalContent>
          <ModalBody mt={5}>
            <PageScrollReusable minHeight="617px" maxHeight="618px">
              <Table size="sm" variant="striped" ref={componentRef}>
                <Thead bgColor="primary" position="sticky" top={0} zIndex={2} h="40px">
                  <Tr>
                    <Th color="white" colSpan={17} textAlign="center">{`Miscellaneous Receipt History from ${moment(dateFrom).format("l")} - ${moment(dateTo).format("l")}`}</Th>
                  </Tr>
                </Thead>

                <Thead bgColor="primary" position="sticky" top={0} zIndex={1} h="40px">
                  <Tr>
                    <Th color="white">Receipt ID</Th>
                    <Th color="white">Supplier Code</Th>
                    <Th color="white">Supplier Name</Th>
                    <Th color="white">Remarks</Th>
                    <Th color="white">Details</Th>
                    <Th color="white">Item Code</Th>
                    <Th color="white">Item Description</Th>
                    <Th color="white">UOM</Th>
                    <Th color="white">Quantity</Th>
                    <Th color="white">Expiration Date</Th>
                    <Th color="white">Transacted by</Th>
                    <Th color="white">Transaction Date</Th>
                  </Tr>
                </Thead>

                <Tbody>
                  {printData?.map((item, i) => (
                    <Tr key={i}>
                      <Td>{item["Receipt Id"]}</Td>
                      <Td>{item["Supplier Code"]}</Td>
                      <Td>{item["Supplier Name"]}</Td>
                      <Td>{item["Remarks"]}</Td>
                      <Td>{item["Details"]}</Td>
                      <Td>{item["Item Code"]}</Td>
                      <Td>{item["Item Description"]}</Td>
                      <Td>{item["UOM"]}</Td>
                      <Td>{item["Quantity"]}</Td>
                      <Td>{item["Expiration Date"]}</Td>
                      <Td>{item["Transacted By"]}</Td>
                      <Td>{item["Transaction Date"]}</Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </PageScrollReusable>
          </ModalBody>

          <ModalFooter mt={7}>
            <ButtonGroup size="sm">
              <Button variant="outline" onClick={() => closeHandler()}>
                Close
              </Button>
              <Button colorScheme="blue" onClick={handlePrint}>
                Print
              </Button>
            </ButtonGroup>
          </ModalFooter>

          {/* PRINT */}
          <Box display="none">
            <PageScrollReusable minHeight="617px" maxHeight="618px">
              <Table size="sm" variant="simple" ref={componentRef}>
                <Thead bgColor="primary" position="sticky" top={0} zIndex={2} h="40px">
                  <Tr>
                    <Th color="white" fontSize="10px" colSpan={17} textAlign="center">{`Miscellaneous Receipt History from ${moment(dateFrom).format("l")} - ${moment(
                      dateTo
                    ).format("l")}`}</Th>
                  </Tr>
                </Thead>

                <Thead bgColor="primary" position="sticky" top="40px" zIndex={1} h="40px">
                  <Tr>
                    <Th color="white" fontSize="8px">
                      Line Number
                    </Th>
                    <Th color="white" fontSize="8px">
                      Receipt ID
                    </Th>
                    <Th color="white" fontSize="8px">
                      Supplier Code
                    </Th>
                    <Th color="white" fontSize="8px">
                      Supplier Name
                    </Th>
                    <Th color="white" fontSize="8px">
                      Remarks
                    </Th>
                    <Th color="white" fontSize="8px">
                      Details
                    </Th>
                    <Th color="white" fontSize="8px">
                      Item Code
                    </Th>
                    <Th color="white" fontSize="8px">
                      Item Description
                    </Th>
                    <Th color="white" fontSize="8px">
                      UOM
                    </Th>
                    <Th color="white" fontSize="8px">
                      Quantity
                    </Th>
                    <Th color="white" fontSize="8px">
                      Transacted by
                    </Th>
                    <Th color="white" fontSize="8px">
                      Transaction Date
                    </Th>
                  </Tr>
                </Thead>

                <Tbody>
                  {printData?.map((item, i) => (
                    <Tr key={i}>
                      <Td fontSize="10px">{item["Line Number"]}</Td>
                      <Td fontSize="10px">{item["Receipt Id"]}</Td>
                      <Td fontSize="10px">{item["Supplier Code"]}</Td>
                      <Td fontSize="10px">{item["Supplier Name"]}</Td>
                      <Td fontSize="10px">{item["Remarks"]}</Td>
                      <Td fontSize="10px">{item["Details"]}</Td>
                      <Td fontSize="10px">{item["Item Code"]}</Td>
                      <Td fontSize="10px">{item["Item Description"]}</Td>
                      <Td fontSize="10px">{item["UOM"]}</Td>
                      <Td fontSize="10px">{item["Quantity"]}</Td>
                      <Td fontSize="10px">{item["Transacted By"]}</Td>
                      <Td fontSize="10px">{item["Transaction Date"]}</Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </PageScrollReusable>
          </Box>

          <style>
            {`
              @media print {
              @page {
                size: landscape;
                margin: 10mm; /* Adjust this for padding */
              }
  
              body {
                padding: 10px; /* Equivalent to padding-4 */
              }
  
              thead {
                display: table-header-group;
              }
  
              tfoot {
                display: table-footer-group;
              }
  
              tbody {
                display: table-row-group;
              }
  
              tr {
                break-inside: avoid; /* Prevent row from splitting */
                page-break-inside: avoid;
              }
  
              td, th {
                padding: 4px; /* Ensures better spacing */
                 border: 1px solid black; 
              }
        
            }
  
            `}
          </style>
        </ModalContent>
      </Modal>
    </>
  );
};

const PrintMiscIssueModal = ({ isOpen, onClose, printData, setPrintData, dateFrom, dateTo, setIsLoading }) => {
  const componentRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const closeHandler = () => {
    setIsLoading(false);
    setPrintData("");
    onClose();
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={() => closeHandler()} isCentered size="6xl">
        <ModalOverlay />
        <ModalContent>
          <ModalBody mt={5}>
            <PageScrollReusable minHeight="617px" maxHeight="618px">
              <Table size="sm" variant="striped" ref={componentRef}>
                <Thead bgColor="primary" position="sticky" top={0} zIndex={2} h="40px">
                  <Tr>
                    <Th color="white" colSpan={17} textAlign="center">{`Miscellaneous Issue History from ${moment(dateFrom).format("l")} - ${moment(dateTo).format("l")}`}</Th>
                  </Tr>
                </Thead>

                <Thead bgColor="primary" position="sticky" top={0} zIndex={1} h="40px">
                  <Tr>
                    <Th color="white">Line Number</Th>
                    <Th color="white">Issue ID</Th>
                    <Th color="white">Customer Code</Th>
                    <Th color="white">Customer Name</Th>
                    <Th color="white">Remarks</Th>
                    <Th color="white">Details</Th>
                    <Th color="white">Item Code</Th>
                    <Th color="white">Item Description</Th>
                    <Th color="white">UOM</Th>
                    <Th color="white">Quantity</Th>
                    <Th color="white">Expiration Date</Th>
                    <Th color="white">Transacted by</Th>
                    <Th color="white">Transaction Date</Th>
                  </Tr>
                </Thead>

                <Tbody>
                  {printData?.map((item, i) => (
                    <Tr key={i}>
                      <Td>{item["Line Number"]}</Td>
                      <Td>{item["Issue ID"]}</Td>
                      <Td>{item["Customer Code"]}</Td>
                      <Td>{item["Customer Name"]}</Td>
                      <Td>{item["Remarks"]}</Td>
                      <Td>{item["Details"]}</Td>
                      <Td>{item["Item Code"]}</Td>
                      <Td>{item["Item Description"]}</Td>
                      <Td>{item["UOM"]}</Td>
                      <Td>{item["Quantity"]}</Td>
                      <Td>{item["Expiration Date"]}</Td>
                      <Td>{item["Transacted By"]}</Td>
                      <Td>{item["Transaction Date"]}</Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </PageScrollReusable>
          </ModalBody>

          <ModalFooter mt={7}>
            <ButtonGroup size="sm">
              <Button variant="outline" onClick={() => closeHandler()}>
                Close
              </Button>
              <Button colorScheme="blue" onClick={handlePrint}>
                Print
              </Button>
            </ButtonGroup>
          </ModalFooter>

          {/* PRINT */}
          <Box display="none">
            <PageScrollReusable minHeight="617px" maxHeight="618px">
              <Table size="sm" variant="simple" ref={componentRef}>
                <Thead bgColor="primary" position="sticky" top={0} zIndex={2} h="40px">
                  <Tr>
                    <Th color="white" fontSize="10px" colSpan={17} textAlign="center">{`Miscellaneous Issue History from ${moment(dateFrom).format("l")} - ${moment(dateTo).format(
                      "l"
                    )}`}</Th>
                  </Tr>
                </Thead>

                <Thead bgColor="primary" position="sticky" top={0} zIndex={1} h="40px">
                  <Tr>
                    <Th color="white" fontSize="8px">
                      Line Number
                    </Th>
                    <Th color="white" fontSize="8px">
                      Issue ID
                    </Th>
                    <Th color="white" fontSize="8px">
                      Customer Code
                    </Th>
                    <Th color="white" fontSize="8px">
                      Customer Name
                    </Th>
                    <Th color="white" fontSize="8px">
                      Remarks
                    </Th>
                    <Th color="white" fontSize="8px">
                      Details
                    </Th>
                    <Th color="white" fontSize="8px">
                      Item Code
                    </Th>
                    <Th color="white" fontSize="8px">
                      Item Description
                    </Th>
                    <Th color="white" fontSize="8px">
                      UOM
                    </Th>
                    <Th color="white" fontSize="8px">
                      Quantity
                    </Th>
                    <Th color="white" fontSize="8px">
                      Expiration Date
                    </Th>
                    <Th color="white" fontSize="8px">
                      Transacted by
                    </Th>
                    <Th color="white" fontSize="8px">
                      Transaction Date
                    </Th>
                  </Tr>
                </Thead>

                <Tbody>
                  {printData?.map((item, i) => (
                    <Tr key={i}>
                      <Td fontSize="10px">{item["Line Number"]}</Td>
                      <Td fontSize="10px">{item["Issue ID"]}</Td>
                      <Td fontSize="10px">{item["Customer Code"]}</Td>
                      <Td fontSize="10px">{item["Customer Name"]}</Td>
                      <Td fontSize="10px">{item["Remarks"]}</Td>
                      <Td fontSize="10px">{item["Details"]}</Td>
                      <Td fontSize="10px">{item["Item Code"]}</Td>
                      <Td fontSize="10px">{item["Item Description"]}</Td>
                      <Td fontSize="10px">{item["UOM"]}</Td>
                      <Td fontSize="10px">{item["Quantity"]}</Td>
                      <Td fontSize="10px">{item["Expiration Date"]}</Td>
                      <Td fontSize="10px">{item["Transacted By"]}</Td>
                      <Td fontSize="10px">{item["Transaction Date"]}</Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </PageScrollReusable>
          </Box>

          <style>
            {`
              @media print {
              @page {
                size: landscape;
                margin: 10mm; /* Adjust this for padding */
              }
  
              body {
                padding: 13px; /* Equivalent to padding-4 */
              }
  
              thead {
                display: table-header-group;
              }
  
              tfoot {
                display: table-footer-group;
              }
  
              tbody {
                display: table-row-group;
              }
  
              tr {
                break-inside: avoid; /* Prevent row from splitting */
                page-break-inside: avoid;
              }
  
              td, th {
                padding: 4px; /* Ensures better spacing */
                 border: 1px solid black; 
              }
        
            }
  
            `}
          </style>
        </ModalContent>
      </Modal>
    </>
  );
};
