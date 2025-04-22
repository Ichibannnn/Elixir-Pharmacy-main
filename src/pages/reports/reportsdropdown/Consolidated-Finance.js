import React, { useEffect, useState } from "react";
import { Flex, Table, Tbody, Td, Th, Thead, Tr, Button, Text } from "@chakra-ui/react";

import moment from "moment";
import apiClient from "../../../services/apiClient";
import PageScrollReusable from "../../../components/PageScroll-Reusable";

export const ConsolidatedReportsFinance = ({ dateFrom, dateTo, setSheetData, search }) => {
  const [consolidatedData, setConsolidatedData] = useState([]);
  const [buttonChanger, setButtonChanger] = useState(true);

  const fetchConsolidatedApi = async (dateFrom, dateTo, search) => {
    const res = await apiClient.get(`Report/ConsolidationFinanceReports?DateFrom=${dateFrom}&DateTo=${dateTo}`, {
      params: {
        Search: search,
      },
    });
    return res.data;
  };

  const fetchConsolidated = () => {
    fetchConsolidatedApi(dateFrom, dateTo, search).then((res) => {
      console.log("res: ", res);

      setConsolidatedData(res);
      setSheetData(res);
    });
  };

  useEffect(() => {
    fetchConsolidated();

    return () => {
      setConsolidatedData([]);
    };
  }, [dateFrom, dateTo, search]);

  // console.log("consolidatedData: ", consolidatedData);

  return (
    <Flex w="full" flexDirection="column">
      <Flex border="1px">
        <PageScrollReusable minHeight="800px" maxHeight="820px">
          <Table size="sm">
            <Thead bgColor="secondary" position="sticky" top={0} zIndex="1">
              <Tr>
                <Th color="white">ID</Th>
                <Th color="white">Transaction Date</Th>
                <Th color="white">Item Code</Th>
                <Th color="white">Item Description</Th>
                {buttonChanger ? (
                  <>
                    <Th color="white">UOM</Th>
                    <Th color="white">Category</Th>
                    <Th color="white">Quantity</Th>
                    <Th color="white">Unit Cost</Th>
                    <Th color="white">Line Amount</Th>
                    <Th color="white">Source</Th>
                    <Th color="white">Transaction Type</Th>
                    <Th color="white">Reason</Th>
                    <Th color="white">Reference</Th>
                    <Th color="white">Encoded By</Th>
                  </>
                ) : (
                  <>
                    <Th color="white">Company Code</Th>
                    <Th color="white">Company Name</Th>
                    <Th color="white">Department Code</Th>
                    <Th color="white">Department Name</Th>
                    <Th color="white">Location Code</Th>
                    <Th color="white">Location Name</Th>
                    <Th color="white">Account Title Code</Th>
                    <Th color="white">Account Title</Th>
                    <Th color="white">EmpID</Th>
                    <Th color="white">Fullname</Th>
                    <Th color="white">Asset Tag</Th>
                    <Th color="white">CIP #</Th>
                    <Th color="white">Helpdesk #</Th>
                    <Th color="white">Remarks</Th>
                    <Th color="white">Rush</Th>
                  </>
                )}
              </Tr>
            </Thead>
            <Tbody>
              {consolidatedData?.map((item, i) => (
                <Tr key={i}>
                  <Td>{item?.id}</Td>
                  <Td>{moment(item?.transactionDate).format("YYYY-MM-DD")}</Td>
                  <Td>{item?.itemCode}</Td>
                  <Td>{item?.itemDescription}</Td>
                  {buttonChanger ? (
                    <>
                      <Td>{item?.uom}</Td>
                      <Td>{item?.category}</Td>
                      <Td>
                        {item?.quantity.toLocaleString(undefined, {
                          maximumFractionDigits: 2,
                          minimumFractionDigits: 2,
                        })}
                      </Td>
                      <Td>
                        {item?.unitCost.toLocaleString(undefined, {
                          maximumFractionDigits: 2,
                          minimumFractionDigits: 2,
                        })}
                      </Td>
                      <Td>
                        {item?.lineAmount.toLocaleString(undefined, {
                          maximumFractionDigits: 2,
                          minimumFractionDigits: 2,
                        })}
                      </Td>
                      <Td>{item?.source}</Td>
                      <Td>{item?.transactionType ? item?.transactionType : "-"}</Td>
                      <Td>{item?.reason ? item?.reason : "-"}</Td>
                      <Td>{item?.reference ? item?.reference : "-"}</Td>
                      <Td>{item?.encodedBy}</Td>
                    </>
                  ) : (
                    <>
                      <Td>{item?.companyCode}</Td>
                      <Td>{item?.companyName}</Td>
                      <Td>{item?.departmentCode}</Td>
                      <Td>{item?.departmentName}</Td>
                      <Td>{item?.locationCode}</Td>
                      <Td>{item?.locationName}</Td>
                      <Td>{item?.accountTitleCode ? item?.accountTitleCode : "-"}</Td>
                      <Td>{item?.accountTitle ? item?.accountTitle : "-"}</Td>
                      <Td>{item?.empId ? item?.empId : "-"}</Td>
                      <Td>{item?.fullname ? item?.fullname : "-"}</Td>
                      <Td>{item?.assetTag ? item?.assetTag : "-"}</Td>
                      <Td>{item?.cipNo ? item?.cipNo : "-"}</Td>
                      <Td>{item?.helpdesk ? item?.helpdesk : "-"}</Td>
                      <Td>{item?.remarks ? item?.remarks : "-"}</Td>
                      <Td>{item?.rush ? item?.rush : "-"}</Td>
                    </>
                  )}
                </Tr>
              ))}
            </Tbody>
          </Table>
        </PageScrollReusable>
      </Flex>

      <Flex justifyContent="space-between" mt={2}>
        <Text fontSize="xs" fontWeight="semibold">
          Total Records: {consolidatedData?.length}
        </Text>

        <Button size="md" colorScheme="blue" onClick={() => setButtonChanger(!buttonChanger)}>
          {buttonChanger ? `>>>>` : `<<<<`}
        </Button>
      </Flex>
    </Flex>
  );
};
