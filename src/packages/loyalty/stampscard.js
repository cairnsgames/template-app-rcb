import React from 'react';
import { Card, Table, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { Postage } from 'react-bootstrap-icons';

const StampsTable = ({ stamps }) => {
  const rows = [];
  for (let i = 0; i < stamps.length; i += 5) {
    rows.push(stamps.slice(i, i + 5));
  }

  return (
    <Card>
      <Card.Header>Stamps</Card.Header>
      <Table bordered>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((stamp, colIndex) => (
                <OverlayTrigger
                  key={stamp.id}
                  placement="top"
                  overlay={
                    <Tooltip id={`tooltip-${stamp.id}`}>
                      {stamp.id} - Earned on: {stamp.date_created}
                    </Tooltip>
                  }
                >
                  <td>
                    <Postage />
                  </td>
                </OverlayTrigger>
              ))}
              {row.length < 5 &&
                Array.from({ length: 5 - row.length }).map((_, emptyIndex) => (
                  <td key={`empty-${emptyIndex}`}></td>
                ))}
            </tr>
          ))}
        </tbody>
      </Table>
    </Card>
  );
};

export default StampsTable;
