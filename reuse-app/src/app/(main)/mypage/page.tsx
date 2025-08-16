import SubHeader from "@/components/common/subHeader";
import { BottomNavigation } from "@/components/layout/bottom-navigation";
import CurrentToken from "./components/currentToken";
import UserProfile from './components/userProfile';


export default function MyPage() {
  const menuItems = [];

  return (
    <div className="min-h-screen bg-slate-50">
      <SubHeader />
      <UserProfile />
      <CurrentToken />
      <div>2</div>
      <div>3</div>
      <div>4</div>
      <BottomNavigation />
    </div>);
}