import React from "react";
import { Carousel, Image, Table } from "react-bootstrap";
import {
  Award,
  AwardFill,
  CheckCircleFill,
  Circle,
  CupHotFill,
  Gift,
  Heart,
  HeartFill,
  Postage,
  PostageFill,
  PostageHeart,
  PostageHeartFill,
  Star, StarFill,
} from "react-bootstrap-icons";
import QRCode from "../../../packages/qrcode/qrcode";
import useUser from "../../../packages/auth/context/useuser";

const CarouselItemContent = (item) => {
  const { user } = useUser();
  return (
    <div>
      <Table bordered>
        <thead>
          <tr>
            <td colSpan={3}>
              <Image
                src={process.env.REACT_APP_FILES + "/" + item.image}
                style={{ height: "125px" }}
              />
            </td>
          </tr>
        </thead>
        <tbody>
  {/* Dynamically generate rows for stamps collected and outstanding, 3 stars per row */}
  {[...Array(9)].map((_, index) => {
    if (index % 3 === 0) {
      // Start a new row every 3 stars
      return (
        <tr key={index}>
          {[...Array(3)].map((_, innerIndex) => {
            const starIndex = index + innerIndex;
            if (starIndex < 9) {
              // For the first 9 stars
              return starIndex < item.stamps_collected ? (
                <td key={starIndex}>
                  <StarFill size={32} style={{ color: "purple" }} />
                </td>
              ) : (
                <td key={starIndex}>
                  <Star size={32} style={{ color: "lightgrey" }} />
                </td>
              );
            } else {
              return null; // Empty cells if less than 3 stars are needed in the row
            }
          })}
        </tr>
      );
    }
    return null; // Only return for every new row start
  })}

  {/* Last row for the 10th star and the prize */}
  <tr>
    {/* 10th Star */}
    <td>
      {item.stamps_collected >= 10 ? (
        <StarFill size={32} style={{ color: "purple" }} />
      ) : (
        <Star size={32} style={{ color: "lightgrey" }} />
      )}
    </td>
    {/* Prize Icon */}
    <td colSpan={2}>
      <Gift size={48} />
    </td>
  </tr>
</tbody>


      </Table>
      <QRCode
        className="mt-5"
        link={`https://juzt.dance/#referral?id=${user.id}`}
        size={160}
        color={"purple"}
        logoWidth={24}
      />
    </div>
  );
};

export default CarouselItemContent;
