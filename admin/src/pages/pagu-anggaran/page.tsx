import { useInit } from "./init";

export default function Page() {
   const {} = useInit();

   return (
      <div className="p-0">
         <div className="border rounded-lg p-6 shadow-sm bg-white space-y-4"></div>
      </div>
   );
}
