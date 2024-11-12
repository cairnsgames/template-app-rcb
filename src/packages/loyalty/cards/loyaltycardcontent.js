import React from "react";
import { Image, Table } from "react-bootstrap";
import { Gift, Star, StarFill } from "react-bootstrap-icons";
import useUser from "../../auth/context/useuser";
import pluralize from "pluralize";
import { combineUrlAndPath } from "../../../functions/combineurlandpath";

const RewardMessage = ({ reward, item }) => {
  if (reward <= 0) {
    // No rewards to display
    return null;
  }

  if (!item.reward_description) {
    // No reward description to display
    return "";
  }

  console.log("!!!! RewardMessage", reward, item);
  const description = item.reward_description.trim();

  // Regular expression to check if the description starts with an article
  const startsWithArticle = /^(a|an|the)\b/i.test(description);

  // Function to pluralize the description
  const getPlural = (text) => {
    // Basic pluralization by adding 's'
    // For more complex cases, consider using a library like 'pluralize'
    // return text.endsWith('s') ? text : `${text}s`;

    // If using 'pluralize' library:
    return pluralize(text);
  };

  // Choose the correct word based on the reward count
  const rewardWord = reward === 1 ? "reward" : "rewards";

  if (startsWithArticle) {
    const article = description.match(/^(a|an|the)\b/i)[0].toLowerCase();
    const itemDescription = description.replace(/^(a|an|the)\b\s*/i, "");

    return (
      <div>
        You have earned{" "}
        <strong>
          {reward} {rewardWord}
        </strong>{" "}
        of {article} <strong>{itemDescription}</strong> so far.
      </div>
    );
  } else {
    // Determine the correct indefinite article ('a' or 'an') if needed
    // (Not required here since description does not start with an article)

    // Pluralize the description if reward is greater than 1
    const formattedDescription =
      reward === 1 ? description : getPlural(description);

    return (
      <div>
        You have earned{" "}
        <strong>
          {reward} {formattedDescription}
        </strong>
        .
      </div>
    );
  }
};

const LoyaltyCardContent = ({ item, index, of, reward }) => {
  const { user } = useUser();
  return (
    <div style={{height:"100%"}}>
      <div style={{fontSize:"0.7rem"}} className="text-center mb-2">Card {index+1} of {of}</div>
      <Table bordered>
        <thead>
          <tr>
            <td colSpan={3}>
              <h3>{item.name}</h3>

              {item.image && (
                <Image
                  src={combineUrlAndPath(process.env.REACT_APP_FILES,item.image)}
                  style={{ height: "125px" }}
                />
              )}
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
      <div className="mb-3">Reward: {item.reward_description}</div>
      {reward > 0 && (
        <div>
          <RewardMessage reward={reward} item={item} />
        </div>
      )}
      <div className="text-start" style={{ color: "black" }}>
        <p>
          You have collected {item.stamps_collected} stamps, you need{" "}
          {10 - item.stamps_collected} more stamps to get your next reward.
        </p>
      </div>
    </div>
  );
};

export default LoyaltyCardContent;
