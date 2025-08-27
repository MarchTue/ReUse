import SubHeader from "@/components/common/subHeader";
import { BottomNavigation } from "@/components/layout/bottom-navigation";
import CurrentToken from "./components/currentToken";
import UserProfile from './components/userProfile';
import Menus from "./components/menus";


export default function MyPage() {

  return (
    <div className="min-h-screen pb-20">
      <SubHeader />
      <UserProfile />
      <CurrentToken />
      <Menus></Menus>
      <BottomNavigation />
    </div>);
}