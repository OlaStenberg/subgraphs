import { toDate } from "../utils";
import { styled } from "../styled";
import { Typography } from "@mui/material";

const IssuesContainer = styled("div")<{ $hasCritical: boolean }>`
  max-height: 230px;
  overflow-y: scroll;
  background-color: rgb(28, 28, 28);
  border: 2px solid ${({ theme, $hasCritical }) => ($hasCritical ? theme.palette.error.main : theme.palette.warning.main)};
  margin-bottom: ${({ theme }) => theme.spacing(2)};
  
  & > * {
    padding: ${({ theme }) => theme.spacing(2)};
  }
  
  & >:nth-of-type(odd):not(:first-child) {
    background: rgba(0, 0, 0, 0.5);
  }
`;

const messagesByLevel = (
  issuesArray: { message: string; type: string; level: string; fieldName: string }[],
): JSX.Element[] => {
  const issuesMsgs = [];
  console.log("ARRAY ISSUEDISPLAY COMPONENT", issuesArray);
  if (issuesArray.length > 0) {
    for (let x = 0; x < issuesArray.length; x++) {
      let issuesMsg = issuesArray[x].fieldName;
      if (issuesArray[x].type === "SUM") {
        issuesMsg =
          "All values in " + issuesArray[x].fieldName + " are zero. Verify that this data is being mapped correctly.";
      }
      if (issuesArray[x].type === "CUMULATIVE") {
        issuesMsg =
          "Cumulative value in field " +
          issuesArray[x].message.split("++")[0] +
          " dropped on " +
          toDate(parseFloat(issuesArray[x].message.split("++")[1])) +
          ". Cumulative values should always increase.";
      }
      if (issuesArray[x].type === "TVL-") {
        issuesMsg = "totalValueLockedUSD on " + issuesArray[x].message + " is below 1000. This is likely erroneous.";
      }
      if (issuesArray[x].type === "TVL+") {
        issuesMsg =
          "totalValueLockedUSD on " + issuesArray[x].message + " is above 1,000,000,000,000. This is likely erroneous.";
      }
      if (issuesArray[x].type === "DEC") {
        issuesMsg = `Decimals on ${issuesArray[x].fieldName} could not be pulled. The default decimal value of 18 has been applied.`;
      }
      issuesMsgs.push(<li>{issuesMsg}</li>);
    }
  }
  return issuesMsgs;
};

interface IssuesProps {
  issuesArray: { message: string; type: string; level: string; fieldName: string }[];
}
// The issues display function takes the issues object passed in and creates the elements/messages to be rendered
export const IssuesDisplay = ({ issuesArray }: IssuesProps) => {
  console.log("issARRAY", issuesArray);
  const criticalIssues = issuesArray.filter((iss) => iss.level === "critical");
  const errorIssues = issuesArray.filter((iss) => iss.level === "error");
  const warningIssues = issuesArray.filter((iss) => {
    console.log("ISS", iss, iss.level === "warning");
    return iss.level === "warning";
  });

  const criticalMsgs = messagesByLevel(criticalIssues);
  const errorMsgs = messagesByLevel(errorIssues);
  const warningMsgs = messagesByLevel(warningIssues);

  const issuesDisplayCount = criticalMsgs.length + errorMsgs.length + warningMsgs.length;
  const hasCritical = criticalMsgs.length > 0;

  let criticalElement = null;
  if (hasCritical) {
    criticalElement = (
      <div>
        <Typography variant="h6">Critical:</Typography>
        <ol><Typography variant="body1">{criticalMsgs}</Typography></ol>
      </div>
    );
  }

  let errorElement = null;
  if (errorMsgs.length > 0) {
    errorElement = (
      <div>
        <Typography variant="h6">Error:</Typography>
        <ol><Typography variant="body1">{errorMsgs}</Typography></ol>
      </div>
    );
  }

  let warningElement = null;
  if (warningMsgs.length > 0) {
    warningElement = (
      <div>
        <Typography variant="h6">Warning:</Typography>
        <ol><Typography variant="body1">{warningMsgs}</Typography></ol>
      </div>
    );
  }

  if (issuesDisplayCount > 0) {
    return (
      <IssuesContainer $hasCritical={hasCritical}>
        <Typography variant="h6">DISPLAYING {issuesDisplayCount} Issues.</Typography>
        {criticalElement}
        {errorElement}
        {warningElement}
      </IssuesContainer>
    );
  } else {
    return null;
  }
};

export default IssuesDisplay;