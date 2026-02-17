import { useLocation, useNavigate, useParams } from "react-router-dom";
import { BikeEditPanel } from "../bike/bike-edit-panel";
import { useTranslation } from "react-i18next";
import { issueDetailsTexts } from "../../i18n/i18n-builder";

export function IssueEditBikeStatusPanel() {
  const { t } = useTranslation();
  const idp = issueDetailsTexts(t);

  const { id } = useParams();
  const loc = useLocation();
  const nav = useNavigate();

  const bikeId = (loc.state as any)?.bikeId as string | undefined;
  const from = (loc.state as any)?.from as string | undefined;

  if (!bikeId) {
    nav(from ?? `/issues/${id}`, { replace: true });
    return null;
  }

  return (
    <BikeEditPanel
      statusOnly
      bikeIdOverride={bikeId}
      returnTo={from ?? `/issues/${id}`}
      titleOverride={idp.EditBikeStatus}
    />
  );
}
