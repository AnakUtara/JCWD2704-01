// "use client";

// import { useEffect, useState } from "react";
// import { useFormState } from "react-dom";

// import { FormErrors } from "@/types/store.action.types";

// import { Button } from "@/components/ui/button";
// import { stepTwoFormAction } from "@/utils/form/create-store-action/stepTwo";

// import { CreateStoreInput } from "./input";
// import { CreateStoreTimePicker } from "./select-time";
// import { useResultData } from "../CreateStoreProvider";

// const initialState: FormErrors = {};
// export default function StepTwoForm() {
//   const [error, formAction] = useFormState(
//     (state: FormErrors | undefined, formData: FormData) =>
//       stepTwoFormAction(state, formData, {
//         start_time: startTime,
//         end_time: endTime,
//       }),
//     initialState,
//   );
//   const [startTime, setStartTime] = useState<Date>();
//   const [endTime, setEndTime] = useState<Date>();
//   const { updateResultData } = useResultData();

//   useEffect(() => {
//     updateResultData({
//       start_time: startTime ? startTime : undefined,
//       end_time: endTime ? endTime : undefined,
//     });
//   }, [startTime, endTime]);

//   return (
//     <form action={formAction} className="flex w-full flex-col justify-between gap-4">
//       <div className="w-full space-y-4">
//         <CreateStoreInput
//           required
//           label="Schedule Name"
//           id="name"
//           type="text"
//           minLenght={5}
//           placeholder="Operation, Weekends, Etc."
//           description="Store schedule will determine the start and end time of operational hours."
//           errorMsg={error?.name}
//         />
//         <div className="flex flex-col gap-4 xl:flex-row">
//           <div className="rounded-md border px-4 py-2">
//             <div className="flex w-full max-w-sm justify-between gap-4">
//               <p className="text-lg font-medium">Start Time</p>
//               <CreateStoreTimePicker date={startTime} setDate={setStartTime} />
//             </div>
//             {error?.start_time && <div className="mt-1 text-sm text-destructive">{error?.start_time}</div>}
//           </div>
//           <div className="rounded-md border px-4 py-2">
//             <div className="flex w-full max-w-sm justify-between gap-4">
//               <p className="text-lg font-medium">End Time</p>
//               <CreateStoreTimePicker date={endTime} setDate={setEndTime} />
//             </div>
//             {error?.end_time && <div className="mt-1 text-sm text-destructive">{error?.end_time}</div>}
//           </div>
//         </div>
//       </div>

//       <Button type="submit" className="md:w-fit md:self-end">
//         Set Schedule
//       </Button>
//     </form>
//   );
// }
