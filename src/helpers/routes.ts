import { notFoundView } from "../views/public/not-found/not-found"
import { uploadFileView } from "../views/public/upload-file/upload-file"
import { resultView } from "../views/result/result"
export const routes ={
    public:[
        {path:"/not-found", component: notFoundView},
        {path:"/upload-file", component: uploadFileView}
    ],
    result:[
        {path:"/result", component:resultView}
    ]
}
