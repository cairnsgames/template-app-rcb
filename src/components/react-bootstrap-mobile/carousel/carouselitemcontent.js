import React from "react";
import { Carousel, Image, Table } from "react-bootstrap";
import {
  Award,
  AwardFill,
  CheckCircleFill,
  Circle,
  Gift,
  Postage,
  PostageFill,
  PostageHeart,
  PostageHeartFill,
  StarFill,
} from "react-bootstrap-icons";
import QRCode from "../../../packages/qrcode/qrcode";

const CarouselItemContent = (item) => {
  return (
      <div>
        <Table bordered>
          <thead>
            <tr>
              <td colSpan={3}>
                <Image src={item.logo} style={{ height: "125px" }} />
              </td>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <Postage size={32} />
              </td>
              <td>
                <PostageFill size={32} />
              </td>
              <td>
                <PostageHeart size={32} />
              </td>
            </tr>
            <tr>
              <td>
                <PostageHeartFill size={32} />
              </td>
              <td>
                <AwardFill size={32} />
              </td>
              <td>
                <Circle size={32} style={{ color: "lightgrey" }} />
              </td>
            </tr>
            <tr>
              <td>
                <Circle size={32} style={{ color: "lightgrey" }} />
              </td>
              <td>
                <Circle size={32} style={{ color: "lightgrey" }} />
              </td>
              <td>
                <CheckCircleFill size={32} style={{ color: "lightgrey" }} />
              </td>
            </tr>
            <tr>
              <td>
                <StarFill size={32} style={{ color: "lightgrey" }} />
              </td>
              <td colSpan={2}>
                <Gift size={48} />
              </td>
            </tr>
          </tbody>
        </Table>
        <QRCode
          className="mt-5"
          value={
            item.name +
            item.name +
            item.name +
            item.name +
            item.name +
            item.name +
            item.name
          }
          size={160}
          fgColor={"purple"}
          logoWidth={24}
        />
      </div>
  );
};

export default CarouselItemContent;
