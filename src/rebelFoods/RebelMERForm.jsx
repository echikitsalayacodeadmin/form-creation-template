import html2pdf from "html2pdf.js";
import React, { useEffect, useState } from "react";
import { getData } from "../assets/services/GetApiCall";
import { useSnackbar } from "notistack";
import { updateData } from "../assets/services/PatchApi";
import { sortDataByName } from "../assets/utils";
import dayjs from "dayjs";
import { uploadFile } from "../assets/services/PostApiCall";
import { EmployeeList } from "./RebelData";

const updatedDataArray = [
  {
    empId: "1012267",
    name: "Prashant Yadav",
    gender: "Male",
    age: 27,
    mobile: 9179954822,
    vitalsCreatedDate: "28/12/2024",
    bp: "140/80",
    height: 169,
    "": 1.69,
    __1: 2.8561,
    weight: 56,
    hip: 92,
    waist: 89,
    spo2Percent: 96,
    eye: "6/6",
    colourVision: "Normal",
    bmi: 19.7,
    heartRate: 77,
  },
  {
    empId: "80217",
    name: "DIKSHA PARMAR",
    gender: "Female",
    age: 24,
    mobile: 8225830663,
    vitalsCreatedDate: "28/12/2024",
    bp: "120/70",
    height: 153,
    "": 1.53,
    __1: 2.3409,
    weight: 53,
    hip: 93,
    waist: 36,
    spo2Percent: 97,
    eye: "6/6",
    colourVision: "Normal",
    bmi: 22.7,
    heartRate: 79,
  },
  {
    empId: "72956",
    name: "Shristi lakhera",
    gender: "Female",
    age: 28,
    mobile: 8269268385,
    vitalsCreatedDate: "28/12/2024",
    bp: "120/70",
    height: 147,
    "": 1.47,
    __1: 2.1609,
    weight: 64,
    hip: 92,
    waist: 84,
    spo2Percent: 96,
    eye: "36/24",
    colourVision: "Normal",
    bmi: 29.7,
    heartRate: 86,
  },
  {
    empId: "80773",
    name: "Piyush Chouhan",
    gender: "Male",
    age: 18,
    mobile: 8109869787,
    vitalsCreatedDate: "28/12/2024",
    bp: "118/79",
    height: 158,
    "": 1.58,
    __1: 2.4964,
    weight: 56,
    hip: 96,
    waist: 79,
    spo2Percent: 98,
    eye: "6/6,N/6",
    colourVision: "Normal",
    bmi: 22.5,
    heartRate: 82,
  },
  {
    empId: "49170",
    name: "Dushyant Batham",
    gender: "Male",
    age: 38,
    mobile: 9303613242,
    vitalsCreatedDate: "28/12/2024",
    bp: "130/80",
    height: 168,
    "": 1.68,
    __1: 2.8224,
    weight: 84,
    hip: 103,
    waist: 99,
    spo2Percent: 98,
    eye: "6/6",
    colourVision: "Normal",
    bmi: 29.8,
    heartRate: 88,
  },
  {
    empId: "55352",
    name: "Archana Khare",
    gender: "Female",
    age: 24,
    mobile: 6265004851,
    vitalsCreatedDate: "28/12/2024",
    bp: "135/75",
    height: 168,
    "": 1.68,
    __1: 2.8224,
    weight: 74,
    hip: 118,
    waist: 108,
    spo2Percent: 103,
    eye: "6/6",
    colourVision: "Normal",
    bmi: 26.3,
    heartRate: 84,
  },
  {
    empId: "58184",
    name: "Devendra Sen",
    gender: "Male",
    age: 28,
    mobile: 8358036461,
    vitalsCreatedDate: "28/12/2024",
    bp: "110/70",
    height: 177,
    "": 1.77,
    __1: 3.1329,
    weight: 81,
    hip: 106,
    waist: 108,
    spo2Percent: 98,
    eye: "6/6",
    colourVision: "Normal",
    bmi: 25.9,
    heartRate: 71,
  },
  {
    empId: "71078",
    name: "Karan yadav",
    gender: "Male",
    age: 25,
    mobile: 9165352450,
    vitalsCreatedDate: "28/12/2024",
    bp: "140/90",
    height: 165,
    "": 1.65,
    __1: 2.7225,
    weight: 62,
    hip: 94,
    waist: 91,
    spo2Percent: 97,
    eye: "36/60",
    colourVision: "Normal",
    bmi: 22.8,
    heartRate: 82,
  },
  {
    empId: "78997",
    name: "Manisha khare",
    gender: "Female",
    age: 20,
    mobile: 9691566920,
    vitalsCreatedDate: "28/12/2024",
    bp: "120/70",
    height: 156,
    "": 1.56,
    __1: 2.4336,
    weight: 61,
    hip: 104,
    waist: 95,
    spo2Percent: 95,
    eye: "6/6",
    colourVision: "Normal",
    bmi: 25.1,
    heartRate: 92,
  },
  {
    empId: "56369",
    name: "Varsha vishwakarma",
    gender: "Female",
    age: 22,
    mobile: 7805017774,
    vitalsCreatedDate: "28/12/2024",
    bp: "110/70",
    height: 156,
    "": 1.56,
    __1: 2.4336,
    weight: 46,
    hip: 87,
    waist: 80,
    spo2Percent: 98,
    eye: "6/6",
    colourVision: "Normal",
    bmi: 19,
    heartRate: 78,
  },
  {
    empId: "42416",
    name: "Diksha Mankar",
    gender: "Female",
    age: 28,
    mobile: 9691353548,
    vitalsCreatedDate: "28/12/2024",
    bp: "110/60",
    height: 158,
    "": 1.58,
    __1: 2.4964,
    weight: 54,
    hip: 100,
    waist: 92,
    spo2Percent: 98,
    eye: "6/6",
    colourVision: "Normal",
    bmi: 21.7,
    heartRate: 86,
  },
  {
    empId: "79290",
    name: "Puspa kakodiya",
    gender: "Female",
    age: 38,
    mobile: 7024748164,
    vitalsCreatedDate: "28/12/2024",
    bp: "147/94",
    height: 147,
    "": 1.47,
    __1: 2.1609,
    weight: 56,
    hip: 101,
    waist: 94,
    spo2Percent: 96,
    eye: "6/6",
    colourVision: "Normal",
    bmi: 26,
    heartRate: 86,
  },
  {
    empId: "78908",
    name: "Poonam sen",
    gender: "Female",
    age: 37,
    mobile: 9165599804,
    vitalsCreatedDate: "28/12/2024",
    bp: "130/90",
    height: 135,
    "": 1.35,
    __1: 1.8225,
    weight: 38,
    hip: 89,
    waist: 83,
    spo2Percent: 95,
    eye: "6/6",
    colourVision: "Normal",
    bmi: 20.9,
    heartRate: 73,
  },
  {
    empId: "61765",
    name: "Ayush dhurve",
    gender: "Male",
    age: 21,
    mobile: 7202437644,
    vitalsCreatedDate: "28/12/2024",
    bp: "140/80",
    height: 170,
    "": 1.7,
    __1: 2.89,
    weight: 79,
    hip: 103,
    waist: 93,
    spo2Percent: 98,
    eye: "6/6",
    colourVision: "Normal",
    bmi: 27.4,
    heartRate: 72,
  },
  {
    empId: "79573",
    name: "Omprakash prajapati",
    gender: "Male",
    age: 27,
    mobile: 8839944880,
    vitalsCreatedDate: "28/12/2024",
    bp: "109/72",
    height: 157,
    "": 1.57,
    __1: 2.4649,
    weight: 45,
    hip: 84,
    waist: 80,
    spo2Percent: 97,
    eye: "6/6",
    colourVision: "Normal",
    bmi: 18.3,
    heartRate: 78,
  },
  {
    empId: "79527",
    name: "Sumit thakur",
    gender: "Male",
    age: 22,
    mobile: 6232374679,
    vitalsCreatedDate: "28/12/2024",
    bp: "127/59",
    height: 166,
    "": 1.66,
    __1: 2.7556,
    weight: 44,
    hip: 82,
    waist: 76,
    spo2Percent: 96,
    eye: "6/6",
    colourVision: "Normal",
    bmi: 16,
    heartRate: 80,
  },
  {
    empId: "80825",
    name: "Ashish mehra",
    gender: "Male",
    age: 23,
    mobile: 6266582343,
    vitalsCreatedDate: "28/12/2024",
    bp: "142/88",
    height: 174,
    "": 1.74,
    __1: 3.0276,
    weight: 77,
    hip: 100,
    waist: 95,
    spo2Percent: 98,
    eye: "6/6",
    colourVision: "Normal",
    bmi: 25.5,
    heartRate: 86,
  },
  {
    empId: "80319",
    name: "Satish maravi",
    gender: "Male",
    age: 22,
    mobile: 913176132,
    vitalsCreatedDate: "28/12/2024",
    bp: "133/85",
    height: 157,
    "": 1.57,
    __1: 2.4649,
    weight: 42,
    hip: 75,
    waist: 70,
    spo2Percent: 96,
    eye: "6/6",
    colourVision: "Normal",
    bmi: 17.1,
    heartRate: 92,
  },
  {
    empId: "79242",
    name: "Chandraprakash",
    gender: "Male",
    age: 29,
    mobile: 8318969776,
    vitalsCreatedDate: "28/12/2024",
    bp: "142/88",
    height: 165,
    "": 1.65,
    __1: 2.7225,
    weight: 65,
    hip: 98,
    waist: 94,
    spo2Percent: 96,
    eye: "6/6",
    colourVision: "Normal",
    bmi: 23.9,
    heartRate: 77,
  },
  {
    empId: "1716",
    name: "Santosh kumar",
    gender: "Male",
    age: 30,
    mobile: 8329359059,
    vitalsCreatedDate: "28/12/2024",
    bp: "130/90",
    height: 158,
    "": 1.58,
    __1: 2.4964,
    weight: 65,
    hip: 95,
    waist: 91,
    spo2Percent: 97,
    eye: "6/6",
    colourVision: "Normal",
    bmi: 26.1,
    heartRate: 80,
  },
  {
    empId: "61779",
    name: "Sachin pal",
    gender: "Male",
    age: 27,
    mobile: 6265178143,
    vitalsCreatedDate: "28/12/2024",
    bp: "120/70",
    height: 170,
    "": 1.7,
    __1: 2.89,
    weight: 50,
    hip: 86,
    waist: 82,
    spo2Percent: 96,
    eye: "6/6",
    colourVision: "Normal",
    bmi: 17.4,
    heartRate: 78,
  },
  {
    empId: "80776",
    name: "Ritesh karashiya",
    gender: "Male",
    age: 28,
    mobile: 8269715217,
    vitalsCreatedDate: "28/12/2024",
    bp: "130/80",
    height: 167,
    "": 1.67,
    __1: 2.7889,
    weight: 70,
    hip: 96,
    waist: 96,
    spo2Percent: 98,
    eye: "6/6",
    colourVision: "Normal",
    bmi: 25.1,
    heartRate: 89,
  },
  {
    empId: "73780",
    name: "Jabar Ansari",
    gender: "Male",
    age: 29,
    mobile: 7028271163,
    vitalsCreatedDate: "28/12/2024",
    bp: "120/90",
    height: 158,
    "": 1.58,
    __1: 2.4964,
    weight: 60,
    hip: 94,
    waist: 88,
    spo2Percent: 98,
    eye: "6/6",
    colourVision: "Normal",
    bmi: 24.1,
    heartRate: 73,
  },
  {
    empId: "63401",
    name: "Sandeep rathore",
    gender: "Male",
    age: 28,
    mobile: 9893358850,
    vitalsCreatedDate: "28/12/2024",
    bp: "120/70",
    height: 167,
    "": 1.67,
    __1: 2.7889,
    weight: 59,
    hip: 91,
    waist: 85,
    spo2Percent: 96,
    eye: "6/6",
    colourVision: "Normal",
    bmi: 21.2,
    heartRate: 86,
  },
  {
    empId: "55824",
    name: "salauddin",
    gender: "Male",
    age: 27,
    mobile: 6394339207,
    vitalsCreatedDate: "28/12/2024",
    bp: "110/80",
    height: 164,
    "": 1.64,
    __1: 2.6896,
    weight: 63,
    hip: 98,
    waist: 90,
    spo2Percent: 97,
    eye: "6/6",
    colourVision: "Normal",
    bmi: 23.5,
    heartRate: 74,
  },
  {
    empId: "81569",
    name: "harsh netam",
    gender: "Male",
    age: 18,
    mobile: 9302259301,
    vitalsCreatedDate: "28/12/2024",
    bp: "130/80",
    height: 170,
    "": 1.7,
    __1: 2.89,
    weight: 63,
    hip: 92,
    waist: 88,
    spo2Percent: 98,
    eye: "6/6",
    colourVision: "Normal",
    bmi: 21.8,
    heartRate: 84,
  },
  {
    empId: "67702",
    name: "ashif",
    gender: "Male",
    age: 30,
    mobile: 7898647046,
    vitalsCreatedDate: "28/12/2024",
    bp: "130/100",
    height: 176,
    "": 1.76,
    __1: 3.0976,
    weight: 68,
    hip: 101,
    waist: 92,
    spo2Percent: 97,
    eye: "6/6",
    colourVision: "Normal",
    bmi: 22,
    heartRate: 72,
  },
  {
    empId: "50665",
    name: "Dhanraj Patil",
    gender: "Male",
    age: 34,
    mobile: "",
    vitalsCreatedDate: "29/12/2024",
    bp: "120/70",
    height: 167,
    "": 1.67,
    __1: 2.7889,
    weight: 61,
    hip: 92,
    waist: 90,
    spo2Percent: 97,
    eye: "Normal",
    colourVision: "Normal",
    bmi: 21.9,
    heartRate: 76,
  },
  {
    empId: "68825",
    name: "RAJ KURMI",
    gender: "Male",
    age: 22,
    mobile: "",
    vitalsCreatedDate: "29-12-2024",
    bp: "134/87",
    height: 182,
    "": 1.82,
    __1: 3.3124,
    weight: 69,
    hip: 90,
    waist: 84,
    spo2Percent: 97,
    eye: "Normal",
    colourVision: "Normal",
    bmi: 20.9,
    heartRate: 82,
  },
  {
    empId: "78934",
    name: "Chhaya Yadav",
    gender: "Female",
    age: 23,
    mobile: "",
    vitalsCreatedDate: "29-12-2024",
    bp: "101/80",
    height: 152,
    "": 1.52,
    __1: 2.3104,
    weight: 59,
    hip: 95,
    waist: 90,
    spo2Percent: 97,
    eye: "Normal",
    colourVision: "Normal",
    bmi: 25.6,
    heartRate: 84,
  },
  {
    empId: "75129",
    name: "SHIVA SEN",
    gender: "MAle",
    age: 28,
    mobile: "",
    vitalsCreatedDate: "29-12-2024",
    bp: "150/100",
    height: 163,
    "": 1.63,
    __1: 2.6569,
    weight: 53,
    hip: 93,
    waist: 87,
    spo2Percent: 98,
    eye: "Normal",
    colourVision: "Normal",
    bmi: 20,
    heartRate: 89,
  },
  {
    empId: "71341",
    name: "SACHIN DIYEWAR",
    gender: "MAle",
    age: 32,
    mobile: "",
    vitalsCreatedDate: "29-12-2024",
    bp: "152/100",
    height: 172,
    "": 1.72,
    __1: 2.9584,
    weight: 93,
    hip: 106,
    waist: 99,
    spo2Percent: 98,
    eye: "Normal",
    colourVision: "Normal",
    bmi: 31.5,
    heartRate: 94,
  },
  {
    empId: "78500",
    name: "SHIVANI THAPA",
    gender: "Female",
    age: 25,
    mobile: "",
    vitalsCreatedDate: "29-12-2024",
    bp: "103/74",
    height: 163,
    "": 1.63,
    __1: 2.6569,
    weight: 45,
    hip: 86,
    waist: 64,
    spo2Percent: 98,
    eye: "Normal",
    colourVision: "Normal",
    bmi: 17,
    heartRate: 84,
  },
  {
    empId: "77989",
    name: "SURESH YADAV",
    gender: "MAle",
    age: 34,
    mobile: "",
    vitalsCreatedDate: "29-12-2024",
    bp: "125/87",
    height: 173,
    "": 1.73,
    __1: 2.9929,
    weight: 71,
    hip: 90,
    waist: 86,
    spo2Percent: 98,
    eye: "Normal",
    colourVision: "Normal",
    bmi: 23.8,
    heartRate: 74,
  },
  {
    empId: "78289",
    name: "AKASH GOGALE",
    gender: "MAle",
    age: 21,
    mobile: "",
    vitalsCreatedDate: "29-12-2024",
    bp: "101/65",
    height: 168,
    "": 1.68,
    __1: 2.8224,
    weight: 54,
    hip: 78,
    waist: 75,
    spo2Percent: 97,
    eye: "Normal",
    colourVision: "Normal",
    bmi: 19.2,
    heartRate: 88,
  },
  {
    empId: "78621",
    name: "AKASH",
    gender: "Male",
    age: 21,
    mobile: "",
    vitalsCreatedDate: "29-12-2024",
    bp: "126/80",
    height: 160,
    "": 1.6,
    __1: 2.56,
    weight: 38,
    hip: 70,
    waist: 64,
    spo2Percent: 96,
    eye: "Normal",
    colourVision: "Normal",
    bmi: 14.9,
    heartRate: 86,
  },
  {
    empId: "80058",
    name: "ADARSH KHERAJ",
    gender: "MAle",
    age: 18,
    mobile: "",
    vitalsCreatedDate: "29-12-2024",
    bp: "113/60",
    height: 160,
    "": 1.6,
    __1: 2.56,
    weight: 42,
    hip: 73,
    waist: 62,
    spo2Percent: 97,
    eye: "Normal",
    colourVision: "Normal",
    bmi: 16.5,
    heartRate: 76,
  },
  {
    empId: "78267",
    name: "SUMIT UMADE",
    gender: "MAle",
    age: 24,
    mobile: "",
    vitalsCreatedDate: "29-12-2024",
    bp: "117/81",
    height: 179,
    "": 1.79,
    __1: 3.2041,
    weight: 62,
    hip: 84,
    waist: 83,
    spo2Percent: 98,
    eye: "Normal",
    colourVision: "Normal",
    bmi: 19.4,
    heartRate: 74,
  },
  {
    empId: "72046",
    name: "TUSHAR KHATRI",
    gender: "MAle",
    age: 24,
    mobile: "",
    vitalsCreatedDate: "29-12-2024",
    bp: "112/73",
    height: 173,
    "": 1.73,
    __1: 2.9929,
    weight: 72,
    hip: 92,
    waist: 90,
    spo2Percent: 97,
    eye: "Normal",
    colourVision: "Normal",
    bmi: 24.1,
    heartRate: 90,
  },
  {
    empId: "80983",
    name: "LAXMI AHIRWAR",
    gender: "Female",
    age: 29,
    mobile: "",
    vitalsCreatedDate: "29-12-2024",
    bp: "120/79",
    height: 159,
    "": 1.59,
    __1: 2.5281,
    weight: 55,
    hip: 94,
    waist: 83,
    spo2Percent: 98,
    eye: "Normal",
    colourVision: "Normal",
    bmi: 21.8,
    heartRate: 89,
  },
  {
    empId: "57697",
    name: "Radha Dubey",
    gender: "Female",
    age: 28,
    mobile: "",
    vitalsCreatedDate: "29-12-2024",
    bp: "120/78",
    height: 168,
    "": 1.68,
    __1: 2.8224,
    weight: 61,
    hip: 95,
    waist: 187,
    spo2Percent: 96,
    eye: "Normal",
    colourVision: "Normal",
    bmi: 21.7,
    heartRate: 88,
  },
  {
    empId: "73057",
    name: "DURGESHWARI",
    gender: "Female",
    age: 22,
    mobile: "",
    vitalsCreatedDate: "29-12-2024",
    bp: "103/74",
    height: 163,
    "": 1.63,
    __1: 2.6569,
    weight: 45,
    hip: 86,
    waist: 64,
    spo2Percent: 98,
    eye: "Normal",
    colourVision: "Normal",
    bmi: 17,
    heartRate: 82,
  },
  {
    empId: "67687",
    name: "DEEPESH TIWARI",
    gender: "Female",
    age: 26,
    mobile: "",
    vitalsCreatedDate: "29-12-2024",
    bp: "134/88",
    height: 174,
    "": 1.74,
    __1: 3.0276,
    weight: 78,
    hip: 94,
    waist: 90,
    spo2Percent: 98,
    eye: "Normal",
    colourVision: "Normal",
    bmi: 25.8,
    heartRate: 77,
  },
  {
    empId: "27049",
    name: "MANISH",
    gender: "Male",
    age: 26,
    mobile: "",
    vitalsCreatedDate: "29-12-2024",
    bp: "160/80",
    height: 167,
    "": 1.67,
    __1: 2.7889,
    weight: 71,
    hip: 74,
    waist: 84,
    spo2Percent: 97,
    eye: "Normal",
    colourVision: "Normal",
    bmi: 25.5,
    heartRate: 76,
  },
  {
    empId: "52658",
    name: "AMAN JAISWAL",
    gender: "Male",
    age: 30,
    mobile: "",
    vitalsCreatedDate: "29-12-2024",
    bp: "136/75",
    height: 177,
    "": 1.77,
    __1: 3.1329,
    weight: 75,
    hip: 94,
    waist: 89,
    spo2Percent: 96,
    eye: "Normal",
    colourVision: "Normal",
    bmi: 24,
    heartRate: 78,
  },
  {
    empId: "81414",
    name: "BHUPENDRA PATEL",
    gender: "Male",
    age: 22,
    mobile: "",
    vitalsCreatedDate: "29-12-2024",
    bp: "140/80",
    height: 180,
    "": 1.8,
    __1: 3.24,
    weight: 57,
    hip: 82,
    waist: 71,
    spo2Percent: 98,
    eye: "Normal",
    colourVision: "Normal",
    bmi: 17.6,
    heartRate: 92,
  },
  {
    empId: "61550",
    name: "BHARAT BHUSHAN",
    gender: "Male",
    age: 30,
    mobile: "",
    vitalsCreatedDate: "29-12-2024",
    bp: "128/83",
    height: 170,
    "": 1.7,
    __1: 2.89,
    weight: 68,
    hip: 92,
    waist: 89,
    spo2Percent: 96,
    eye: "Normal",
    colourVision: "Normal",
    bmi: 23.6,
    heartRate: 88,
  },
  {
    empId: "1022559",
    name: "PRASHANT YADAV",
    gender: "Male",
    age: 21,
    mobile: "",
    vitalsCreatedDate: "29-12-2024",
    bp: "130/66",
    height: 168,
    "": 1.68,
    __1: 2.8224,
    weight: 50,
    hip: 80,
    waist: 67,
    spo2Percent: 98,
    eye: "Normal",
    colourVision: "Normal",
    bmi: 17.8,
    heartRate: 86,
  },
  {
    empId: "79575",
    name: "ANSH YADAV",
    gender: "Male",
    age: 18,
    mobile: "",
    vitalsCreatedDate: "29-12-2024",
    bp: "140/90",
    height: 167,
    "": 1.67,
    __1: 2.7889,
    weight: 44,
    hip: 77,
    waist: 68,
    spo2Percent: 98,
    eye: "Normal",
    colourVision: "Normal",
    bmi: 15.8,
    heartRate: 86,
  },
  {
    empId: "75129",
    name: "SHIVA SEN",
    gender: "Male",
    age: 28,
    mobile: "",
    vitalsCreatedDate: "29-12-2024",
    bp: "150/100",
    height: 163,
    "": 1.63,
    __1: 2.6569,
    weight: 53,
    hip: 93,
    waist: 87,
    spo2Percent: 98,
    eye: "Normal",
    colourVision: "Normal",
    bmi: 20,
    heartRate: 72,
  },
  {
    empId: "81003",
    name: "HARENDRA",
    gender: "Male",
    age: 29,
    mobile: "",
    vitalsCreatedDate: "29-12-2024",
    bp: "123/63",
    height: 167,
    "": 1.67,
    __1: 2.7889,
    weight: 65,
    hip: 75,
    waist: 65,
    spo2Percent: 96,
    eye: "Normal",
    colourVision: "Normal",
    bmi: 23.4,
    heartRate: 74,
  },
  {
    empId: "81005",
    name: "SHIV TARKALE",
    gender: "Male",
    age: 19,
    mobile: "",
    vitalsCreatedDate: "29-12-2024",
    bp: "138/83",
    height: 173,
    "": 1.73,
    __1: 2.9929,
    weight: 49,
    hip: 80,
    waist: 63,
    spo2Percent: 98,
    eye: "Normal",
    colourVision: "Normal",
    bmi: 16.4,
    heartRate: 82,
  },
  {
    empId: "45727",
    name: "RAHUL VERMA",
    gender: "Male",
    age: 30,
    mobile: "",
    vitalsCreatedDate: "29-12-2024",
    bp: "123/72",
    height: 167,
    "": 1.67,
    __1: 2.7889,
    weight: 70,
    hip: 95,
    waist: 93,
    spo2Percent: 96,
    eye: "Normal",
    colourVision: "Normal",
    bmi: 25.1,
    heartRate: 89,
  },
  {
    empId: "81336",
    name: "SURENDRA",
    gender: "Male",
    age: 27,
    mobile: "",
    vitalsCreatedDate: "29-12-2024",
    bp: "133/89",
    height: 180,
    "": 1.8,
    __1: 3.24,
    weight: 74,
    hip: 93,
    waist: 90,
    spo2Percent: 97,
    eye: "Normal",
    colourVision: "Normal",
    bmi: 22.9,
    heartRate: 88,
  },
];

const RebelMERForm = ({
  corpId = "dd491d3b-8a1b-493a-99cf-730fafa7c468", ///rebelcamp
  //corpId = "2ef9842f-552f-464e-831c-28ce3ada1715",
  // corpId = "872cd841-9f7a-432d-b8e9-422b780bca10",
  // campCycleId = ""
  campCycleId = "",
  fileType = "CONSOLIDATED_REPORT",
  //fileType = "FITNESS_CERTIFICATE",
  startDate = dayjs("2024-10-22"),
  endDate = dayjs("2024-10-22"),
  //corpName = "Lite Bite Foods Pvt. Ltd.",
  corpName = "Rebel Foods Pvt. Ltd",
  campDate = "29 Dec, 2024",
}) => {
  const { enqueueSnackbar } = useSnackbar();
  const batchSize = 50;
  const [list, setList] = useState([]);
  const [totalEmployees, setTotalEmployees] = useState(0);
  const [uploadedCount, setUploadedCount] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);

  const generatePDF = async (data, index) => {
    const PHYSICAL_FITNESS_FORM = `

    <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
    <html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">
      <head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <title>a4d932fb-451d-4918-9ba4-5bc1b7a214d7</title>
        <style type="text/css">
          * {
            margin: 0;
            padding: 0;
            text-indent: 0;
          }
          .s1 {
            color: black;
            font-family: Calibri, sans-serif;
            font-style: normal;
            font-weight: bold;
            text-decoration: none;
            font-size: 13pt;
          }
          .s2 {
            color: black;
            font-family: Calibri, sans-serif;
            font-style: normal;
            font-weight: bold;
            text-decoration: none;
            font-size: 12pt;
          }
          .s3 {
            color: black;
            font-family: Calibri, sans-serif;
            font-style: normal;
            font-weight: normal;
            text-decoration: none;
            font-size: 12pt;
          }
          h1 {
            color: black;
            font-family: "Times New Roman", serif;
            font-style: normal;
            font-weight: bold;
            text-decoration: none;
            font-size: 15pt;
          }
          .s4 {
            color: black;
            font-family: "Times New Roman", serif;
            font-style: normal;
            font-weight: normal;
            text-decoration: none;
            font-size: 12pt;
          }
          .s6 {
            color: black;
            font-family: "Times New Roman", serif;
            font-style: italic;
            font-weight: normal;
            text-decoration: none;
            font-size: 12pt;
          }
          .s7 {
            color: black;
            font-family: "Times New Roman", serif;
            font-style: normal;
            font-weight: normal;
            text-decoration: none;
            font-size: 11pt;
          }
          .s8 {
            color: black;
            font-family: Calibri, sans-serif;
            font-style: normal;
            font-weight: normal;
            text-decoration: none;
            font-size: 16pt;
          }
          p {
            color: black;
            font-family: Calibri, sans-serif;
            font-style: normal;
            font-weight: normal;
            text-decoration: none;
            font-size: 12pt;
            margin: 0pt;
          }
          .s10 {
            color: black;
            font-family: Arial, sans-serif;
            font-style: normal;
            font-weight: bold;
            text-decoration: none;
            font-size: 10.5pt;
          }
          .s11 {
            color: black;
            font-family: Arial, sans-serif;
            font-style: normal;
            font-weight: normal;
            text-decoration: none;
            font-size: 9pt;
          }
          h2 {
            color: black;
            font-family: Calibri, sans-serif;
            font-style: normal;
            font-weight: bold;
            text-decoration: none;
            font-size: 14pt;
          }
          .h4 {
            color: black;
            font-family: Calibri, sans-serif;
            font-style: normal;
            font-weight: bold;
            text-decoration: underline;
            font-size: 11pt;
          }
          .s12 {
            color: black;
            font-family: Calibri, sans-serif;
            font-style: normal;
            font-weight: normal;
            text-decoration: none;
            font-size: 10.5pt;
          }
          li {
            display: block;
          }
          #l1 {
            padding-left: 0pt;
            counter-reset: c1 1;
          }
          #l1 > li > *:first-child:before {
            counter-increment: c1;
            content: counter(c1, decimal) ". ";
            color: black;
            font-style: normal;
            font-weight: normal;
            text-decoration: none;
          }
          #l1 > li:first-child > *:first-child:before {
            counter-increment: c1 0;
          }
          table,
          tbody {
            vertical-align: top;
            overflow: visible;
          }
        </style>
      </head>
      <body>
        <div style="padding-left: 5%; padding-right: 5%; padding-top: 3%">
          <table
            style="
              width: 100%;
              border-collapse: collapse;
              font-size: 12px;
              font-weight: bold;
            "
          >
            <tr style="height: 30pt">
              <td
                style="
                  width: 480pt;
                  border-top-style: solid;
                  border-top-width: 1pt;
                  border-left-style: solid;
                  border-left-width: 1pt;
                  border-bottom-style: solid;
                  border-bottom-width: 1pt;
                  border-right-style: solid;
                  border-right-width: 1pt;
                  background-color: #c0c0c0;
                "
                colspan="3"
              >
                <p
                  class="s1"
                  style="
                    padding-top: 9pt;
                    padding-left: 122pt;
                    text-indent: 0pt;
                    text-align: left;
                  "
                >
                  Health Check Up Form - MER
                </p>
              </td>
            </tr>
            <tr style="height: 24pt">
              <td
                style="
                  width: 480pt;
                  border-top-style: solid;
                  border-top-width: 1pt;
                  border-left-style: solid;
                  border-left-width: 1pt;
                  border-bottom-style: solid;
                  border-bottom-width: 1pt;
                  border-right-style: solid;
                  border-right-width: 1pt;
                  background-color: #bbbbbb;
                "
                colspan="3"
              >
                <p
                  class="s2"
                  style="
                    padding-top: 4pt;
                    padding-left: 2pt;
                    text-indent: 0pt;
                    text-align: left;
                  "
                >
                  GENERAL INFORMATION
                </p>
              </td>
            </tr>
            <tr style="height: 24pt">
              <td
                style="
                  width: 44pt;
                  border-top-style: solid;
                  border-top-width: 1pt;
                  border-left-style: solid;
                  border-left-width: 1pt;
                  border-bottom-style: solid;
                  border-bottom-width: 1pt;
                  border-right-style: solid;
                  border-right-width: 1pt;
                "
              >
                <p
                  class="s3"
                  style="
                    padding-top: 4pt;
                    padding-left: 2pt;
                    text-indent: 0pt;
                    text-align: left;
                  "
                >
                  Name
                </p>
              </td>
              <td
                style="
                  width: 270pt;
                  border-top-style: solid;
                  border-top-width: 1pt;
                  border-left-style: solid;
                  border-left-width: 1pt;
                  border-bottom-style: solid;
                  border-bottom-width: 1pt;
                  border-right-style: solid;
                  border-right-width: 1pt;
                "
              >
                <p style="  padding-top: 4pt;
                    padding-left: 2pt;
                    text-indent: 0pt;
                    text-align: left;"><span style="text-transform: capitalize; font-weight: 400"
                    >${data?.name?.toLowerCase() || ""}</span
                  ></p>
              </td>
              <td
                style="
                  width: 166pt;
                  border-top-style: solid;
                  border-top-width: 1pt;
                  border-left-style: solid;
                  border-left-width: 1pt;
                  border-bottom-style: solid;
                  border-bottom-width: 1pt;
                  border-right-style: solid;
                  border-right-width: 1pt;
                "
              >
                <p
                  class="s3"
                  style="
                    padding-top: 6pt;
                    padding-left: 8pt;
                    text-indent: 0pt;
                    text-align: left;
                  "
                >
                  Employee ID:
                  <span style="text-transform: capitalize; font-weight: 400"
                    >${data?.empId || ""}</span
                  >
                </p>
              </td>
            </tr>
            <tr style="height: 24pt">
              <td
                style="
                  width: 480pt;
                  border-top-style: solid;
                  border-top-width: 1pt;
                  border-left-style: solid;
                  border-left-width: 1pt;
                  border-bottom-style: solid;
                  border-bottom-width: 1pt;
                  border-right-style: solid;
                  border-right-width: 1pt;
                "
                colspan="3"
              >
                <p
                  class="s3"
                  style="
                    padding-top: 4pt;
                    padding-left: 2pt;
                    text-indent: 0pt;
                    text-align: left;
                  "
                >
                  Age and Gender:
                  <span style="text-transform: capitalize; font-weight: 400"
                    >${data?.age ? data?.age + " " + "Years" : ""} ${
      data?.gender?.toLowerCase() || ""
    }</span
                  >
                </p>
              </td>
            </tr>
            <tr style="height: 24pt">
              <td
                style="
                  width: 480pt;
                  border-top-style: solid;
                  border-top-width: 1pt;
                  border-left-style: solid;
                  border-left-width: 1pt;
                  border-bottom-style: solid;
                  border-bottom-width: 1pt;
                  border-right-style: solid;
                  border-right-width: 1pt;
                "
                colspan="3"
              >
                <p
                  class="s3"
                  style="
                    padding-top: 4pt;
                    padding-left: 2pt;
                    text-indent: 0pt;
                    text-align: left;
                  "
                >
                  Date of Health check-up:
                  <span style="text-transform: capitalize; font-weight: 400"
                    >${campDate}</span
                  >
                </p>
              </td>
            </tr>
            <tr style="height: 22pt">
              <td
                style="
                  width: 480pt;
                  border-top-style: solid;
                  border-top-width: 1pt;
                  border-left-style: solid;
                  border-left-width: 1pt;
                  border-bottom-style: solid;
                  border-bottom-width: 1pt;
                  border-right-style: solid;
                  border-right-width: 1pt;
                "
                colspan="3"
              >
                <p
                  class="s3"
                  style="
                    padding-top: 3pt;
                    padding-left: 2pt;
                    text-indent: 0pt;
                    text-align: left;
                  "
                >
                  Contact Number:
                  <span style="text-transform: capitalize; font-weight: 400"
                    >${data?.mobileNo || ""}</span
                  >
                </p>
              </td>
            </tr>
            <tr style="height: 19pt">
              <td
                style="
                  width: 480pt;
                  border-top-style: solid;
                  border-top-width: 1pt;
                  border-left-style: solid;
                  border-left-width: 1pt;
                  border-bottom-style: solid;
                  border-bottom-width: 1pt;
                  border-right-style: solid;
                  border-right-width: 1pt;
                "
                colspan="3"
              >
                <p style="  padding-top: 4pt;
                    padding-left: 2pt;
                    text-indent: 0pt;
                    text-align: left;"><br /></p>
              </td>
            </tr>
            <tr style="height: 19pt">
              <td
                style="
                  width: 169pt;
                  border-top-style: solid;
                  border-top-width: 1pt;
                  border-left-style: solid;
                  border-left-width: 1pt;
                  border-bottom-style: solid;
                  border-bottom-width: 1pt;
                  border-right-style: solid;
                  border-right-width: 1pt;
                  background-color: #bbbbbb;
                "
                colspan="2"
              >
                <p
                  class="s2"
                  style="padding-left: 2pt;   padding-top: 4pt;
                    padding-left: 2pt;
                    text-indent: 0pt;
                    text-align: left;"
                >
                  Vaccine
                </p>
              </td>
              <td
                style="
                  width: 311pt;
                  border-top-style: solid;
                  border-top-width: 1pt;
                  border-left-style: solid;
                  border-left-width: 1pt;
                  border-bottom-style: solid;
                  border-bottom-width: 1pt;
                  border-right-style: solid;
                  border-right-width: 1pt;
                  background-color: #bbbbbb;
                "
              >
                <p
                  class="s2"
                  style="padding-left: 2pt;   padding-top: 4pt;
                    padding-left: 2pt;
                    text-indent: 0pt;
                    text-align: left;"
                >
                  Remark
                </p>
              </td>
            </tr>
            <tr style="height: 23pt">
              <td
                style="
                  width: 169pt;
                  border-top-style: solid;
                  border-top-width: 1pt;
                  border-left-style: solid;
                  border-left-width: 1pt;
                  border-bottom-style: solid;
                  border-bottom-width: 1pt;
                  border-right-style: solid;
                  border-right-width: 1pt;
                "
                colspan="2"
              >
                <p style="  padding-top: 4pt;
                    padding-left: 2pt;
                    text-indent: 0pt;
                    text-align: left;"><br /></p>
              </td>
              <td
                style="
                  width: 311pt;
                  border-top-style: solid;
                  border-top-width: 1pt;
                  border-left-style: solid;
                  border-left-width: 1pt;
                  border-bottom-style: solid;
                  border-bottom-width: 1pt;
                  border-right-style: solid;
                  border-right-width: 1pt;
                "
              >
                <p style="  padding-top: 4pt;
                    padding-left: 2pt;
                    text-indent: 0pt;
                    text-align: left;"><br /></p>
              </td>
            </tr>
            <tr style="height: 24pt">
              <td
                style="
                  width: 169pt;
                  border-top-style: solid;
                  border-top-width: 1pt;
                  border-left-style: solid;
                  border-left-width: 1pt;
                  border-bottom-style: solid;
                  border-bottom-width: 1pt;
                  border-right-style: solid;
                  border-right-width: 1pt;
                "
                colspan="2"
              >
                <p class="s3" style="  padding-top: 4pt;
                    padding-left: 2pt;
                    text-indent: 0pt;
                    text-align: left;">
                  Typhoid (1 Dose) Bharat Biotech International Ltd
                </p>
              </td>
              <td
                style="
                  width: 311pt;
                  border-top-style: solid;
                  border-top-width: 1pt;
                  border-left-style: solid;
                  border-left-width: 1pt;
                  border-bottom-style: solid;
                  border-bottom-width: 1pt;
                  border-right-style: solid;
                  border-right-width: 1pt;
                "
              >
                <p class="s3" style="  padding-top: 4pt;
                    padding-left: 2pt;
                    text-indent: 0pt;
                    text-align: left;">
                  Batch Number: 54B24002A
                </p>
              </td>
            </tr>
            <tr style="height: 24pt">
              <td
                style="
                  width: 169pt;
                  border-top-style: solid;
                  border-top-width: 1pt;
                  border-left-style: solid;
                  border-left-width: 1pt;
                  border-bottom-style: solid;
                  border-bottom-width: 1pt;
                  border-right-style: solid;
                  border-right-width: 1pt;
                "
                colspan="2"
              >
                <p style="  padding-top: 4pt;
                    padding-left: 2pt;
                    text-indent: 0pt;
                    text-align: left;"><br /></p>
              </td>
              <td
                style="
                  width: 311pt;
                  border-top-style: solid;
                  border-top-width: 1pt;
                  border-left-style: solid;
                  border-left-width: 1pt;
                  border-bottom-style: solid;
                  border-bottom-width: 1pt;
                  border-right-style: solid;
                  border-right-width: 1pt;
                "
              >
                <p
                  class="s3"
                  style="
                    padding-top: 3pt;
                    padding-left: 1pt;
                    text-indent: 0pt;
                    text-align: left;
                  "
                >
                  Date of Expiry: <span style="text-transform: capitalize; font-weight: 400"
                    >${"May, 2027"}</span
                  >
                </p>
              </td>
            </tr>
            <tr style="height: 19pt">
              <td
                style="
                  width: 480pt;
                  border-top-style: solid;
                  border-top-width: 1pt;
                  border-left-style: solid;
                  border-left-width: 1pt;
                  border-bottom-style: solid;
                  border-bottom-width: 1pt;
                  border-right-style: solid;
                  border-right-width: 1pt;
                  background-color: #d0cece;
                "
                colspan="3"
              >
                <p
                  class="s2"
                  style="padding-left: 2pt;   padding-top: 4pt;
                    padding-left: 2pt;
                    text-indent: 0pt;
                    text-align: left;"
                >
                  Vitals
                </p>
              </td>
            </tr>
            <tr style="height: 17pt">
              <td
                style="
                  width: 169pt;
                  border-top-style: solid;
                  border-top-width: 1pt;
                  border-left-style: solid;
                  border-left-width: 1pt;
                  border-bottom-style: solid;
                  border-bottom-width: 1pt;
                  border-right-style: solid;
                  border-right-width: 1pt;
                "
                colspan="2"
              >
                <p
                  class="s3"
                  style="
                    padding-left: 2pt;
                    text-indent: 0pt;
                    line-height: 14pt;
                    text-align: left;
                  "
                >
                  Height
                </p>
              </td>
              <td
                style="
                  width: 311pt;
                  border-top-style: solid;
                  border-top-width: 1pt;
                  border-left-style: solid;
                  border-left-width: 1pt;
                  border-bottom-style: solid;
                  border-bottom-width: 1pt;
                  border-right-style: solid;
                  border-right-width: 1pt;
                "
              >
                <p style="  padding-top: 4pt;
                    padding-left: 2pt;
                    text-indent: 0pt;
                    text-align: left;">
                  <span style="text-transform: capitalize; font-weight: 400"
                    >${
                      // data?.height ? data?.height + " " + "cm" : ""
                      updatedDataArray
                        .find((item) => item?.empId === data?.empId)
                        ?.height.toString() +
                      " " +
                      "cm"
                    }</span
                  >
                </p>
              </td>
            </tr>
            <tr style="height: 18pt">
              <td
                style="
                  width: 169pt;
                  border-top-style: solid;
                  border-top-width: 1pt;
                  border-left-style: solid;
                  border-left-width: 1pt;
                  border-bottom-style: solid;
                  border-bottom-width: 1pt;
                  border-right-style: solid;
                  border-right-width: 1pt;
                "
                colspan="2"
              >
                <p
                  class="s3"
                  style="
                    padding-left: 2pt;
                    text-indent: 0pt;
                    line-height: 14pt;
                    text-align: left;
                  "
                >
                  Weight
                </p>
              </td>
              <td
                style="
                  width: 311pt;
                  border-top-style: solid;
                  border-top-width: 1pt;
                  border-left-style: solid;
                  border-left-width: 1pt;
                  border-bottom-style: solid;
                  border-bottom-width: 1pt;
                  border-right-style: solid;
                  border-right-width: 1pt;
                "
              >
                <p style="  padding-top: 4pt;
                    padding-left: 2pt;
                    text-indent: 0pt;
                    text-align: left;">
                  <span style="text-transform: capitalize; font-weight: 400"
                    >${
                      // data?.weight ? data?.weight + " " + "kg" : ""
                      updatedDataArray
                        .find((item) => item?.empId === data?.empId)
                        ?.weight.toString() +
                      " " +
                      "kg"
                    }</span
                  >
                </p>
              </td>
            </tr>
            <tr style="height: 17pt">
              <td
                style="
                  width: 169pt;
                  border-top-style: solid;
                  border-top-width: 1pt;
                  border-left-style: solid;
                  border-left-width: 1pt;
                  border-bottom-style: solid;
                  border-bottom-width: 1pt;
                  border-right-style: solid;
                  border-right-width: 1pt;
                "
                colspan="2"
              >
                <p
                  class="s3"
                  style="
                    padding-left: 2pt;
                    text-indent: 0pt;
                    line-height: 14pt;
                    text-align: left;
                  "
                >
                  BMI
                </p>
              </td>
              <td
                style="
                  width: 311pt;
                  border-top-style: solid;
                  border-top-width: 1pt;
                  border-left-style: solid;
                  border-left-width: 1pt;
                  border-bottom-style: solid;
                  border-bottom-width: 1pt;
                  border-right-style: solid;
                  border-right-width: 1pt;
                "
              >
                <p style="  padding-top: 4pt;
                    padding-left: 2pt;
                    text-indent: 0pt;
                    text-align: left;">
                  <span style="text-transform: capitalize; font-weight: 400"
                    >${updatedDataArray
                      .find((item) => item?.empId === data?.empId)
                      ?.bmi.toString()}</span
                  >
                </p>
              </td>
            </tr>
            <tr style="height: 17pt">
              <td
                style="
                  width: 169pt;
                  border-top-style: solid;
                  border-top-width: 1pt;
                  border-left-style: solid;
                  border-left-width: 1pt;
                  border-bottom-style: solid;
                  border-bottom-width: 1pt;
                  border-right-style: solid;
                  border-right-width: 1pt;
                "
                colspan="2"
              >
                <p
                  class="s3"
                  style="
                    padding-left: 2pt;
                    text-indent: 0pt;
                    line-height: 14pt;
                    text-align: left;
                  "
                >
                  Waist Hip Ratio
                </p>
              </td>
              <td
                style="
                  width: 311pt;
                  border-top-style: solid;
                  border-top-width: 1pt;
                  border-left-style: solid;
                  border-left-width: 1pt;
                  border-bottom-style: solid;
                  border-bottom-width: 1pt;
                  border-right-style: solid;
                  border-right-width: 1pt;
                "
              >
                <p style="  padding-top: 4pt;
                    padding-left: 2pt;
                    text-indent: 0pt;
                    text-align: left;">
                  <span style="text-transform: capitalize; font-weight: 400"
                    >${
                      // data?.waistGirth && data?.hipGirth
                      //   ? (data?.waistGirth / data?.hipGirth).toFixed(2)
                      //   : ""
                      updatedDataArray
                        .find((item) => item.empId === data?.empId)
                        ?.waist.toString()
                    }</span
                  >
                </p>
              </td>
            </tr>
            <tr style="height: 17pt">
              <td
                style="
                  width: 169pt;
                  border-top-style: solid;
                  border-top-width: 1pt;
                  border-left-style: solid;
                  border-left-width: 1pt;
                  border-bottom-style: solid;
                  border-bottom-width: 1pt;
                  border-right-style: solid;
                  border-right-width: 1pt;
                "
                colspan="2"
              >
                <p
                  class="s3"
                  style="
                    padding-left: 2pt;
                    text-indent: 0pt;
                    line-height: 14pt;
                    text-align: left;
                  "
                >
                  Blood Pressure
                </p>
              </td>
              <td
                style="
                  width: 311pt;
                  border-top-style: solid;
                  border-top-width: 1pt;
                  border-left-style: solid;
                  border-left-width: 1pt;
                  border-bottom-style: solid;
                  border-bottom-width: 1pt;
                  border-right-style: solid;
                  border-right-width: 1pt;
                "
              >
                <p style="  padding-top: 4pt;
                    padding-left: 2pt;
                    text-indent: 0pt;
                    text-align: left;">
                  <span style="text-transform: capitalize; font-weight: 400"
                    >${
                      // data?.bp ? data?.bp + " " + "mmHg" : ""
                      updatedDataArray
                        .find((item) => item?.empId === data?.empId)
                        ?.bp.toString() +
                      " " +
                      "mmHg"
                    }</span
                  >
                </p>
              </td>
            </tr>
            <tr style="height: 18pt">
              <td
                style="
                  width: 169pt;
                  border-top-style: solid;
                  border-top-width: 1pt;
                  border-left-style: solid;
                  border-left-width: 1pt;
                  border-bottom-style: solid;
                  border-bottom-width: 1pt;
                  border-right-style: solid;
                  border-right-width: 1pt;
                "
                colspan="2"
              >
                <p
                  class="s3"
                  style="
                    padding-left: 2pt;
                    text-indent: 0pt;
                    line-height: 14pt;
                    text-align: left;
                  "
                >
                  Heart Rate
                </p>
              </td>
              <td
                style="
                  width: 311pt;
                  border-top-style: solid;
                  border-top-width: 1pt;
                  border-left-style: solid;
                  border-left-width: 1pt;
                  border-bottom-style: solid;
                  border-bottom-width: 1pt;
                  border-right-style: solid;
                  border-right-width: 1pt;
                "
              >
                <p style="  padding-top: 4pt;
                    padding-left: 2pt;
                    text-indent: 0pt;
                    text-align: left;">
                  <span style="text-transform: capitalize; font-weight: 400"
                    >${updatedDataArray
                      .find((item) => item.empId === data?.empId)
                      ?.heartRate.toString()}</span
                  >
                </p>
              </td>
            </tr>
            <tr style="height: 19pt">
              <td
                style="
                  width: 169pt;
                  border-top-style: solid;
                  border-top-width: 1pt;
                  border-left-style: solid;
                  border-left-width: 1pt;
                  border-bottom-style: solid;
                  border-bottom-width: 1pt;
                  border-right-style: solid;
                  border-right-width: 1pt;
                "
                colspan="2"
              >
                <p
                  class="s3"
                  style="padding-left: 2pt;   padding-top: 4pt;
                    padding-left: 2pt;
                    text-indent: 0pt;
                    text-align: left;"
                >
                  SPO2
                </p>
              </td>
              <td
                style="
                  width: 311pt;
                  border-top-style: solid;
                  border-top-width: 1pt;
                  border-left-style: solid;
                  border-left-width: 1pt;
                  border-bottom-style: solid;
                  border-bottom-width: 1pt;
                  border-right-style: solid;
                  border-right-width: 1pt;
                "
              >
                <p style="  padding-top: 4pt;
                    padding-left: 2pt;
                    text-indent: 0pt;
                    text-align: left;">
                  <span style="text-transform: capitalize; font-weight: 400"
                    >${
                      // data?.spO2Percent ? data?.spO2Percent + " " + "%" : ""
                      updatedDataArray
                        .find((item) => item.empId === data?.empId)
                        ?.spo2Percent.toString()
                    }</span
                  >
                </p>
              </td>
            </tr>
          </table>
          <table
            style="
              width: 100%;
              border-collapse: collapse;
              font-size: 12px;
              font-weight: bold;
            "
          >
            <tr style="height: 20pt">
              <td
                style="
                  border-left-style: solid;
                  border-left-width: 1pt;
                  border-bottom-style: solid;
                  border-bottom-width: 1pt;
                  border-right-style: solid;
                  border-right-width: 1pt;
                  background-color: #d0cece;
                "
                colspan="4"
              >
                <p
                  class="s2"
                  style="padding-left: 2pt;   padding-top: 4pt;
                    padding-left: 2pt;
                    text-indent: 0pt;
                    text-align: left;"
                >
                  Eye Vision
                </p>
              </td>
            </tr>
            <tr style="height: 29pt">
              <td
                style="
                  width: 169pt;
                  border-top-style: solid;
                  border-top-width: 1pt;
                  border-left-style: solid;
                  border-left-width: 1pt;
                  border-bottom-style: solid;
                  border-bottom-width: 1pt;
                  border-right-style: solid;
                  border-right-width: 1pt;
                "
              >
                <p
                  class="s3"
                  style="padding-left: 2pt;   padding-top: 4pt;
                    padding-left: 2pt;
                    text-indent: 0pt;
                    text-align: left;"
                >
                  Left Eye
                </p>
              </td>
              <td
                style="
                  width: 145pt;
                  border-top-style: solid;
                  border-top-width: 1pt;
                  border-left-style: solid;
                  border-left-width: 1pt;
                  border-bottom-style: solid;
                  border-bottom-width: 1pt;
                  border-right-style: solid;
                  border-right-width: 1pt;
                "
              >
                <p style="  padding-top: 4pt;
                    padding-left: 2pt;
                    text-indent: 0pt;
                    text-align: left;"></p>
              </td>
              <td
                style="
                  width: 166pt;
                  border-top-style: solid;
                  border-top-width: 1pt;
                  border-left-style: solid;
                  border-left-width: 1pt;
                  border-bottom-style: solid;
                  border-bottom-width: 1pt;
                  border-right-style: solid;
                  border-right-width: 1pt;
                "
              >
                <p
                  class="s3"
                  style="padding-left: 1pt;   padding-top: 4pt;
                    padding-left: 2pt;
                    text-indent: 0pt;
                    text-align: left;"
                >
                  Right Eye
                </p>
              </td>
            </tr>
            <tr style="height: 20pt">
              <td
                style="
                  width: 169pt;
                  border-top-style: solid;
                  border-top-width: 1pt;
                  border-left-style: solid;
                  border-left-width: 1pt;
                  border-bottom-style: solid;
                  border-bottom-width: 1pt;
                  border-right-style: solid;
                  border-right-width: 1pt;
                "
              >
                <p style="  padding-top: 4pt;
                    padding-left: 2pt;
                    text-indent: 0pt;
                    text-align: left;">
                  <span style="text-transform: capitalize; font-weight: 400"
                    >${
                      data?.nearLeftEyeSight ? data?.nearLeftEyeSight : ""
                    }</span
                  >
                </p>
              </td>
              <td
                style="
                  width: 145pt;
                  border-top-style: solid;
                  border-top-width: 1pt;
                  border-left-style: solid;
                  border-left-width: 1pt;
                  border-bottom-style: solid;
                  border-bottom-width: 1pt;
                  border-right-style: solid;
                  border-right-width: 1pt;
                "
              >
                <p
                  class="s3"
                  style="padding-left: 2pt;   padding-top: 4pt;
                    padding-left: 2pt;
                    text-indent: 0pt;
                    text-align: left;"
                >
                  Near Vision
                </p>
              </td>
              <td
                style="
                  width: 166pt;
                  border-top-style: solid;
                  border-top-width: 1pt;
                  border-left-style: solid;
                  border-left-width: 1pt;
                  border-bottom-style: solid;
                  border-bottom-width: 1pt;
                  border-right-style: solid;
                  border-right-width: 1pt;
                "
              >
                <p style="  padding-top: 4pt;
                    padding-left: 2pt;
                    text-indent: 0pt;
                    text-align: left;">
                  <span style="text-transform: capitalize; font-weight: 400"
                    >${
                      data?.nearRightEyeSight ? data?.nearRightEyeSight : ""
                    }</span
                  >
                </p>
              </td>
            </tr>
            <tr style="height: 21pt">
              <td
                style="
                  width: 169pt;
                  border-top-style: solid;
                  border-top-width: 1pt;
                  border-left-style: solid;
                  border-left-width: 1pt;
                  border-bottom-style: solid;
                  border-bottom-width: 1pt;
                  border-right-style: solid;
                  border-right-width: 1pt;
                "
              >
                <p style="  padding-top: 4pt;
                    padding-left: 2pt;
                    text-indent: 0pt;
                    text-align: left;">
                  <span style="text-transform: capitalize; font-weight: 400"
                    >${data?.farLeftEyeSight ? data?.farLeftEyeSight : ""}</span
                  >
                </p>
              </td>
              <td
                style="
                  width: 145pt;
                  border-top-style: solid;
                  border-top-width: 1pt;
                  border-left-style: solid;
                  border-left-width: 1pt;
                  border-bottom-style: solid;
                  border-bottom-width: 1pt;
                  border-right-style: solid;
                  border-right-width: 1pt;
                "
              >
                <p
                  class="s3"
                  style="padding-left: 2pt;   padding-top: 4pt;
                    padding-left: 2pt;
                    text-indent: 0pt;
                    text-align: left;"
                >
                  Distance Vision
                </p>
              </td>
              <td
                style="
                  width: 166pt;
                  border-top-style: solid;
                  border-top-width: 1pt;
                  border-left-style: solid;
                  border-left-width: 1pt;
                  border-bottom-style: solid;
                  border-bottom-width: 1pt;
                  border-right-style: solid;
                  border-right-width: 1pt;
                "
              >
                <p style="  padding-top: 4pt;
                    padding-left: 2pt;
                    text-indent: 0pt;
                    text-align: left;">
                  <span style="text-transform: capitalize; font-weight: 400"
                    >${
                      data?.farRightEyeSight ? data?.farRightEyeSight : ""
                    }</span
                  >
                </p>
              </td>
            </tr>
            <tr style="height: 25pt">
              <td
                style="
                  width: 169pt;
                  border-top-style: solid;
                  border-top-width: 1pt;
                  border-left-style: solid;
                  border-left-width: 1pt;
                  border-bottom-style: solid;
                  border-bottom-width: 1pt;
                  border-right-style: solid;
                  border-right-width: 1pt;
                "
              >
                <p style="  padding-top: 4pt;
                    padding-left: 2pt;
                    text-indent: 0pt;
                    text-align: left;">
                  <span style="text-transform: capitalize; font-weight: 400"
                    >${data?.colourVision ? data?.colourVision : ""}</span
                  >
                </p>
              </td>
              <td
                style="
                  width: 145pt;
                  border-top-style: solid;
                  border-top-width: 1pt;
                  border-left-style: solid;
                  border-left-width: 1pt;
                  border-bottom-style: solid;
                  border-bottom-width: 1pt;
                  border-right-style: solid;
                  border-right-width: 1pt;
                "
              >
                <p
                  class="s3"
                  style="padding-left: 2pt;   padding-top: 4pt;
                    padding-left: 2pt;
                    text-indent: 0pt;
                    text-align: left;"
                >
                  Colour Vision-
                </p>
              </td>
              <td
                style="
                  width: 166pt;
                  border-top-style: solid;
                  border-top-width: 1pt;
                  border-left-style: solid;
                  border-left-width: 1pt;
                  border-bottom-style: solid;
                  border-bottom-width: 1pt;
                  border-right-style: solid;
                  border-right-width: 1pt;
                "
              >
                <p style="  padding-top: 4pt;
                    padding-left: 2pt;
                    text-indent: 0pt;
                    text-align: left;">
                  <span style="text-transform: capitalize; font-weight: 400"
                    >${updatedDataArray
                      .find((item) => item.empId === data?.empId)
                      ?.colourVision.toString()}</span
                  >
                </p>
              </td>
            </tr>
          </table>
          <table
            style="
              width: 100%;
              border-collapse: collapse;
              font-size: 12px;
              font-weight: bold;
            "
          >
            <tr style="height: 25pt; width: 100%">
              <td
                style="
                  border-top-style: solid;
                  border-top-width: 1pt;
                  border-left-style: solid;
                  border-left-width: 1pt;
                  border-bottom-style: solid;
                  border-bottom-width: 1pt;
                  border-right-style: solid;
                  border-right-width: 1pt;
                  background-color: #d0cece;
                "
              >
                <p
                  class="s2"
                  style="padding-left: 2pt;   padding-top: 4pt;
                    padding-left: 2pt;
                    text-indent: 0pt;
                    text-align: left;"
                >
                  Skin Examination
                </p>
              </td>
            </tr>
            <tr style="height: 25pt; width: 100%">
              <td
                style="
                  border-top-style: solid;
                  border-top-width: 1pt;
                  border-left-style: solid;
                  border-left-width: 1pt;
                  border-bottom-style: solid;
                  border-bottom-width: 1pt;
                  border-right-style: solid;
                  border-right-width: 1pt;
                "
              >
                <p
                  class="s3"
                  style="padding-left: 2pt;   padding-top: 4pt;
                    padding-left: 2pt;
                    text-indent: 0pt;
                    text-align: left;"
                >
                  Remark: NORMAL
                </p>
              </td>
            </tr>
            <tr style="height: 38pt; width: 100%">
              <td
                style="
                  border-top-style: solid;
                  border-top-width: 1pt;
                  border-left-style: solid;
                  border-left-width: 1pt;
                  border-bottom-style: solid;
                  border-bottom-width: 1pt;
                  border-right-style: solid;
                  border-right-width: 1pt;
                "
              >
                <p
                  class="s2"
                  style="
                    padding-left: 2pt;
                    text-indent: 0pt;
                    line-height: 15pt;
                    text-align: left;
                  "
                >
                  Doctor Consultation with Fitness certificate:
                </p>
              </td>
            </tr>
          </table>
         </div>
      </body>
    </html>
    
    `;

    const pdfBlob = await html2pdf()
      .from(PHYSICAL_FITNESS_FORM)
      .output("blob")
      .then((data) => {
        return data;
      });

    // const url = URL.createObjectURL(pdfBlob);
    // window.open(url, "_blank");

    const formData = new FormData();
    formData.append("file", pdfBlob, `${data.empId}_consolidated.pdf`);
    // formData.append("file", pdfBlob, `${data.empId}_physical_fitness_form.pdf`);

    const url = `https://apibackend.uno.care/api/org/upload?empId=${data?.empId}&fileType=${fileType}&corpId=${corpId}&campCycleId=${campCycleId}`;
    const result = await uploadFile(url, formData);
    if (result && result.data) {
      enqueueSnackbar("Successfully Uploaded PDF!", {
        variant: "success",
      });
      setUploadedCount((prevCount) => prevCount + 1);
      // const url = URL.createObjectURL(pdfBlob);
      // window.open(url, "_blank");
    } else {
      enqueueSnackbar("An error Occurred!", {
        variant: "error",
      });
    }
  };

  const fetchListOfEmployees = async () => {
    // const url = `https://apibackend.uno.care/api/org/detailed/all?corpId=${corpId}&campCycleId=${campCycleId}`;
    const url = `https://apibackend.uno.care/api/org/superMasterData?corpId=${corpId}&campCycleId=${campCycleId}`;
    const result = await getData(url);
    if (result && result.data) {
      console.log("Fetched Data successfully");

      const temp = result?.data.filter(
        (item) => item.vitalsCreatedDate === "2024-12-29"
        // ||
        //   item.vitalsCreatedDate === "2024-12-29"
      );

      // filter((item) => EmployeeList.includes(item.empId));

      console.log({ list: temp.map((item) => item.empId).join(",") });
      const length = temp.length;
      console.log({ length });
      setList(sortDataByName(temp));
      setTotalEmployees(temp.length);
      console.log({ empLisy: sortDataByName(temp) });
    } else {
      console.log("An error Occurred");
    }
  };

  useEffect(() => {
    fetchListOfEmployees();
  }, []);

  const handleGeneratePDFs = async () => {
    for (let i = 0; i < list.length; i++) {
      await generatePDF(list[i], i);
    }
  };
  const handleDeletePDF = async () => {
    for (let i = 0; i < list.length; i++) {
      await deleteFiles(list[i]);
    }
  };

  const deleteFiles = async (data) => {
    const url = `https://apibackend.uno.care/api/org/employee/delete/file?corpId=${corpId}&toDeletefiletype=${fileType}&empId=${data.empId}`;
    const result = await updateData(url);
    if (result && result.data) {
      enqueueSnackbar("Successfully Uploaded PDF!", {
        variant: "success",
      });
      setUploadedCount((prevCount) => prevCount + 1);
    } else {
      enqueueSnackbar("An error Occurred!", {
        variant: "error",
      });
    }
  };

  return (
    <div>
      <div>
        <button onClick={handleGeneratePDFs}>Start Generating</button> <br />
        <button onClick={handleDeletePDF}>Delete Files</button>
        <div>Total Employees: {totalEmployees}</div> <br />
        <div>Uploaded Files: {uploadedCount}</div> <br />
        {list.map((item, index) => (
          <div key={index} style={{ display: "flex" }}>
            <div key={index}>{`${index}- ${item.empId} ${item.name}`}</div>

            {fileType === "FITNESS_CERTIFICATE" ? (
              <a href={item.fitnessCertificateUrl}>
                <div key={index}>{item.fitnessCertificateUrl}</div>
              </a>
            ) : (
              <a href={item.consolidatedRUrl}>
                <div key={index}>{item.consolidatedRUrl}</div>
              </a>
            )}

            <br />
          </div>
        ))}
      </div>
    </div>
  );
};

export default RebelMERForm;
