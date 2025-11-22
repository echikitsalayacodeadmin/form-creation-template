import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";

import front from "./front.jpg";
import back from "./back.jpg";
import unocareLogo from "./unocareLogo.png";
import liugongLogo from "./liugongLogo.png";
import unoLogoR from "./unoLogoR.png";
import TimeRoman from "../assets/fonts/Times-Roman.ttf";
import TimeRomanBold from "../assets/fonts/Times-Bold.ttf";

Font.register({ family: "Times-Roman-Normal", src: TimeRoman });
Font.register({ family: "Times-Roman-Bold", src: TimeRomanBold });

const textSizes = {
  name: "10pt",
  label: "5.8pt",
  value: "5.8pt",
  sectionTitle: "7.4pt",
  highlightedText: "6.4pt",
  footer: "6pt",
};

const styles = StyleSheet.create({
  a4Page: {
    width: "210mm",
    height: "297mm",
    paddingTop: 5,
    paddingLeft: "18mm",
    flexDirection: "column",
    backgroundColor: "#fff",
    fontFamily: "Times-Roman-Normal",
  },

  cardWrapper: {
    width: "174mm",
    height: "57mm",
    marginBottom: "3mm",
  },

  cardRow: {
    width: "174mm",
    height: "57mm",
    flexDirection: "row",
    position: "relative",
    rowGap: "1mm",
  },

  leftPanel: {
    width: "87mm",
    height: "57mm",
    position: "relative",
  },
  rightPanel: {
    width: "87mm",
    height: "57mm",
    position: "relative",
  },

  bgImg: {
    position: "absolute",
    width: "87mm",
    height: "57mm",
    top: 0,
    left: 0,
  },

  contentBox: {
    padding: 7,
    position: "absolute",
    top: 0,
    left: 0,
    width: "87mm",
    height: "57mm",
  },

  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 3,
  },

  nameText: {
    fontSize: textSizes.name,
    fontWeight: "bold",
    color: "#1E3A8A",
    marginBottom: 5,
    fontFamily: "Times-Roman-Bold",
  },

  label: {
    fontSize: textSizes.label,
    color: "#1E3A8A",
    marginBottom: 0.8,
  },

  value: {
    fontSize: textSizes.value,
    color: "#000",
    fontWeight: "normal",
  },

  title: {
    fontSize: textSizes.sectionTitle,
    fontWeight: "bold",
    color: "#1E3A8A",
    marginBottom: 2,
    marginTop: 1,
  },

  footer: {
    position: "absolute",
    bottom: 10,
    left: 0,
    width: "95%",
    textAlign: "center",
    fontSize: textSizes.footer,
    color: "#000000",
    fontWeight: "bold",
    fontFamily: "Times-Roman-Bold",
  },

  photoFrame: {
    width: 58,
    height: 58,
    borderRadius: 29,
    border: "2pt solid #1E40AF",
    overflow: "hidden",
    marginBottom: 3,
  },

  line: {
    borderBottom: "2pt solid #0013b9",
    marginVertical: 3,
    height: "0.5mm",
    width: "45mm",
    left: 0,
    position: "absolute",
    top: "55%",
  },

  detailRow: {
    flexDirection: "row",
    marginBottom: 0.8,
  },

  detailLabel: {
    fontSize: textSizes.label,
    color: "#1E3A8A",
    width: "45%",
  },

  detailValue: {
    fontSize: textSizes.value,
    color: "#000",
    flexDirection: "row",
  },

  backLogos: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    bottom: 10,
    left: 0,
    width: "100%",
  },

  pathologyGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 2,
  },

  pathologyItem: {
    width: "33.33%",
    marginBottom: 2,
  },
});

const CardUnit = ({ data }) => {
  return (
    <View style={styles.cardRow}>
      {/* FRONT */}
      <View style={styles.leftPanel}>
        <Image src={front} style={styles.bgImg} />

        <View style={styles.contentBox}>
          <View style={styles.headerRow}>
            <Image
              src={unoLogoR}
              style={{ width: "28.3mm", height: "4.55mm" }}
            />
            <Image
              src={liugongLogo}
              style={{ width: "15.4mm", height: "3.4mm" }}
            />
          </View>

          <View style={{ flexDirection: "row", marginTop: 10 }}>
            <View style={{ width: "60%", paddingRight: 3 }}>
              <View>
                <Text style={styles.nameText}>{data.name}</Text>
              </View>
              <View
                style={{
                  width: "100%",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                }}
              >
                <View
                  style={{
                    width: "43%",
                    flexDirection: "row",
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      width: "27pt",
                    }}
                  >
                    <Text style={[styles.label]}>Emp code</Text>
                    <Text style={[styles.label]}>: </Text>
                  </View>
                  <Text style={styles.value}>{data?.emp_id || "NA"}</Text>
                </View>

                <View
                  style={{
                    width: "57%",
                    flexDirection: "row",
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      width: "34pt",
                    }}
                  >
                    <Text style={styles.label}>Test Dt</Text>
                    <Text style={styles.label}>: </Text>
                  </View>
                  <Text style={styles.value}>{data?.date || "NA"}</Text>
                </View>
                <View
                  style={{
                    width: "43%",
                    flexDirection: "row",
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      width: "27pt",
                    }}
                  >
                    <Text style={[styles.label]}>Height</Text>
                    <Text style={[styles.label]}>: </Text>
                  </View>
                  <Text style={styles.value}>
                    {data?.height ? `${data?.height} cm` : ""}
                  </Text>
                </View>
                <View
                  style={{
                    width: "57%",
                    flexDirection: "row",
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      width: "34pt",
                    }}
                  >
                    <Text style={styles.label}>Weight</Text>
                    <Text style={styles.label}>: </Text>
                  </View>
                  <Text style={styles.value}>
                    {data?.weight ? `${data?.weight} kg` : ""}
                  </Text>
                </View>
                <View
                  style={{
                    width: "43%",
                    flexDirection: "row",
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      width: "27pt",
                    }}
                  >
                    <Text style={[styles.label]}>Pulse</Text>
                    <Text style={[styles.label]}>: </Text>
                  </View>
                  <Text style={styles.value}>
                    {data?.pulse_rate ? `${data?.pulse_rate} bpm` : ""}
                  </Text>
                </View>
                <View
                  style={{
                    width: "57%",
                    flexDirection: "row",
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      width: "34pt",
                    }}
                  >
                    <Text style={styles.label}>BP</Text>
                    <Text style={styles.label}>: </Text>
                  </View>
                  <Text style={styles.value}>
                    {data?.bp ? `${data?.bp} mmHg` : ""}
                  </Text>
                </View>
                <View
                  style={{
                    width: "43%",
                    flexDirection: "row",
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      width: "27pt",
                    }}
                  >
                    <Text style={[styles.label]}>BMI</Text>
                    <Text style={[styles.label]}>: </Text>
                  </View>
                  <Text style={styles.value}>{data?.BMI || "NA"}</Text>
                </View>
                <View
                  style={{
                    width: "57%",
                    flexDirection: "row",
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      width: "34pt",
                    }}
                  >
                    <Text style={styles.label}>Bmi Remark</Text>
                    <Text style={styles.label}>: </Text>
                  </View>

                  <Text style={styles.value}>{data?.["BMI Remark"]}</Text>
                </View>
              </View>
            </View>
            <View
              style={{
                width: "35%",
                flexDirection: "row",
                alignItems: "center",
                position: "absolute",
                right: 10,
                marginTop: 16,
              }}
            >
              <Image
                src={data?.image_url}
                alt=""
                style={{
                  height: "27mm",
                  width: "27mm",
                  objectFit: "cover",
                  borderRadius: "50%",
                }}
              />
            </View>
          </View>

          <View style={styles.line} />

          <View style={{ flexDirection: "row", marginTop: 15 }}>
            <View style={{ width: "60%", paddingRight: 3 }}>
              <View>
                <Text style={styles.nameText}>Vision Test</Text>
              </View>
              <View
                style={{
                  width: "100%",
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                    }}
                  >
                    <Text style={[styles.label]}>Result</Text>
                    <Text style={[styles.label]}>: </Text>
                  </View>
                  <Text style={styles.value}>{data?.["Vision Remark"]}</Text>
                </View>

                <View
                  style={{
                    flexDirection: "row",
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                    }}
                  >
                    <Text style={[styles.label]}>Color Blindness</Text>
                    <Text style={[styles.label]}>: </Text>
                  </View>
                  <Text style={styles.value}>{data?.["colour Blindness"]}</Text>
                </View>
              </View>
            </View>
          </View>

          <Text style={styles.footer}>
            Eat Healthy | Sleep Well | Move Daily | Think Positive
          </Text>
        </View>
      </View>

      {/* BACK */}
      <View style={styles.rightPanel}>
        <Image src={back} style={styles.bgImg} />

        <View style={styles.contentBox}>
          <Text style={styles.nameText}>PATHOLOGY REPORT</Text>

          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            {/* COLUMN 1 */}
            <View style={{ width: "45%" }}>
              {/* HB */}
              <View style={{ flexDirection: "row" }}>
                <View style={{ width: "20mm" }}>
                  <Text style={styles.value}>HB</Text>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <Text style={[styles.value, { marginLeft: 5 }]}>
                    : {data?.hb || "NA"}
                  </Text>
                  <Text style={[styles.value, { marginLeft: 5 }]}>g/dL</Text>
                </View>
              </View>

              {/* MPV */}
              <View style={{ flexDirection: "row" }}>
                <View style={{ width: "20mm" }}>
                  <Text style={styles.value}>Mean platelet volume</Text>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <Text style={[styles.value, { marginLeft: 5 }]}>
                    : {data?.MPV || "NA"}
                  </Text>
                  <Text style={[styles.value, { marginLeft: 5 }]}>fL</Text>
                </View>
              </View>

              {/* CHOL */}
              <View style={{ flexDirection: "row" }}>
                <View style={{ width: "20mm" }}>
                  <Text style={styles.value}>CHOL</Text>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <Text style={[styles.value, { marginLeft: 5 }]}>
                    : {data?.s_cholesterol || "NA"}
                  </Text>
                  <Text style={[styles.value, { marginLeft: 5 }]}>mg/dL</Text>
                </View>
              </View>
            </View>

            {/* COLUMN 2 */}
            <View style={{ width: "27%" }}>
              {/* RBC */}
              <View style={{ flexDirection: "row" }}>
                <View style={{ width: "25%" }}>
                  <Text style={styles.value}>RBC</Text>
                </View>
                <View
                  style={{
                    width: "65%",
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <Text style={[styles.value, { marginLeft: 5 }]}>
                    : {data?.RBC || "NA"}
                  </Text>
                  <Text style={[styles.value, { marginLeft: 5 }]}>/µL</Text>
                </View>
              </View>

              {/* Platelet (PLT.C) */}
              <View style={{ flexDirection: "row" }}>
                <View style={{ width: "25%" }}>
                  <Text style={styles.value}>PLT.C</Text>
                </View>
                <View
                  style={{
                    width: "65%",
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <Text style={[styles.value, { marginLeft: 5 }]}>
                    : {data?.platelet || "NA"}
                  </Text>
                  <Text style={[styles.value, { marginLeft: 5 }]}>/µL</Text>
                </View>
              </View>

              {/* ESR */}
              <View style={{ flexDirection: "row" }}>
                <View style={{ width: "25%" }}>
                  <Text style={styles.value}>ESR</Text>
                </View>
                <View
                  style={{
                    width: "65%",
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <Text style={[styles.value, { marginLeft: 5 }]}>
                    : {data?.esr || "NA"}
                  </Text>
                  <Text style={[styles.value, { marginLeft: 5 }]}>mm/hr</Text>
                </View>
              </View>
            </View>

            {/* COLUMN 3 */}
            <View style={{ width: "27%" }}>
              {/* WBC */}
              <View style={{ flexDirection: "row" }}>
                <View style={{ width: "25%" }}>
                  <Text style={styles.value}>WBC</Text>
                </View>
                <View
                  style={{
                    width: "65%",
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <Text style={[styles.value, { marginLeft: 5 }]}>
                    : {data?.wbc || "NA"}
                  </Text>
                  <Text style={[styles.value, { marginLeft: 5 }]}>/µL</Text>
                </View>
              </View>

              {/* RBS */}
              <View style={{ flexDirection: "row" }}>
                <View style={{ width: "25%" }}>
                  <Text style={styles.value}>RBS</Text>
                </View>
                <View
                  style={{
                    width: "65%",
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <Text style={[styles.value, { marginLeft: 5 }]}>
                    : {data?.blood_sugar_random || "NA"}
                  </Text>
                  <Text style={[styles.value, { marginLeft: 5 }]}>mg/dL</Text>
                </View>
              </View>
            </View>
          </View>
        </View>
        <View
          style={{
            width: "100%",
            borderTop: "1pt solid #0013b9",
            borderBottom: "1pt solid #0013b9",
            marginTop: 50,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              paddingHorizontal: 10,
              paddingVertical: 2,
            }}
          >
            <View style={{ width: "33%", flexDirection: "row" }}>
              <Text
                style={{
                  color: "#0013b9",
                  fontSize: textSizes.highlightedText,
                }}
              >
                Urine Report
              </Text>
            </View>
            <View style={{ width: "33%", flexDirection: "row" }}>
              <Text
                style={{
                  color: "#0013b9",
                  fontSize: textSizes.highlightedText,
                }}
              >
                Proteins:
              </Text>
              <Text
                style={{
                  color: "#0013b9",
                  fontSize: textSizes.highlightedText,
                }}
              >
                {data?.urine_protein || "NA"}
              </Text>
            </View>
            <View style={{ width: "33%", flexDirection: "row" }}>
              <Text
                style={{
                  color: "#0013b9",
                  fontSize: textSizes.highlightedText,
                }}
              >
                Glucose:
              </Text>
              <Text
                style={{
                  color: "#0013b9",
                  fontSize: textSizes.highlightedText,
                }}
              >
                {data?.urine_glucose || "NA"}
              </Text>
            </View>
          </View>
        </View>

        <View style={{ padding: 7 }}>
          <View style={{ flexDirection: "row" }}>
            <Text style={[styles.label, { color: "#0013b9" }]}>Xray:</Text>
            <Text style={[{ marginLeft: "5pt" }, styles.value]}>Normal</Text>
          </View>
          <View style={{ flexDirection: "row" }}>
            <Text style={[styles.label, { color: "#0013b9" }]}>PFT:</Text>
            <Text style={[{ marginLeft: "5pt" }, styles.value]}>
              {data?.pft || "NA"}
            </Text>
          </View>
          <View style={{ flexDirection: "row" }}>
            <Text style={[styles.label, { color: "#0013b9" }]}>ECG:</Text>
            <Text style={[{ marginLeft: "5pt" }, styles.value]}>
              {data?.ecg || "NA"}
            </Text>
          </View>
          <View style={{ flexDirection: "row" }}>
            <Text style={[styles.label, { color: "#0013b9" }]}>
              Audiometry:
            </Text>
            <Text style={[{ marginLeft: "5pt" }, styles.value]}>
              : {data?.Audiometry_remarks || "NA"}
            </Text>
          </View>
          <View style={{ flexDirection: "row" }}>
            <Text style={[styles.label, { color: "#0013b9" }]}>Advice:</Text>
            <Text style={[{ marginLeft: "5pt" }, styles.value]}>
              {data?.["Dr advice"] || "NA"}
            </Text>
          </View>
        </View>

        <View style={styles.backLogos}>
          <Image src={unoLogoR} style={{ height: "3.3mm", marginRight: 5 }} />
          <View
            style={{
              height: "4mm",
              width: "0.3mm",
              backgroundColor: "black",
              marginRight: 5,
            }}
          />
          <Image
            src={liugongLogo}
            style={{ width: "16.5mm", height: "4.1mm" }}
          />
        </View>
      </View>
    </View>
  );
};

export const LiugongA4Sheet = ({ employees }) => {
  // Split employees into chunks of 5
  const chunkSize = 4;
  const pages = [];
  for (let i = 0; i < employees.length; i += chunkSize) {
    pages.push(employees.slice(i, i + chunkSize));
  }

  return (
    <Document>
      {pages.map((group, pageIndex) => (
        <Page key={pageIndex} size="A4" style={styles.a4Page}>
          {group.map((emp, i) => (
            <View key={i} style={styles.cardWrapper}>
              <CardUnit data={emp} />
            </View>
          ))}
        </Page>
      ))}
    </Document>
  );
};
