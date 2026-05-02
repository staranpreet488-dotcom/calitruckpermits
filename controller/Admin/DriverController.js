



const DriverModel = require("../../Model/DriverModel");
const Model = require("../../Model/Index");
const LinkModel = require("../../Model/LinkModel");
const pdfmodel =require("../../Model/allpdf")

require('dotenv').config();
const BASE_URL = process.env.LiveBase_url || 'http://localhost:2000';

const helper = require("../../utility/helper");
const helpers = require("../../utility/helpers");


const puppeteer = require("puppeteer");
const ejs = require("ejs");
const path = require("path");
const fs = require("fs");
const { model } = require("mongoose");

const generatePDF = async (driver) => {
  const dir = path.join(process.cwd(), "public/pdfs");

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const filePath = path.join(
    dir,
    `driver_${driver.FirstName}.pdf`
  );

  

  const html = await ejs.renderFile(
    path.join(__dirname, "../../views/Admin/Link/pdfTemplate.ejs"),
    { data: driver }
  );
  console.log(driver,"licensebacklicensebacklicensebacklicenseback")


  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.setContent(html, { waitUntil: "load" });

  await page.pdf({
    path: filePath,
    format: "A4",
    printBackground: true,
  });

  await browser.close();

  return filePath;
};
const generateMedicalPDF = async (driver) => {

  const dir = path.join(process.cwd(), "public/pdfs");

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const filePath = path.join(
    dir,
    `../../public/pdfs/MedcicalCer_${driver.FirstName}.pdf`
  );

  const html = await ejs.renderFile(
    path.join(__dirname, "../../views/Admin/Link/MedicalCer.ejs"),
    { data: driver }
  );

  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.setContent(html, { waitUntil: "load" });

  await page.pdf({
    path: filePath,
    format: "A4",
    printBackground: true,
  });

  await browser.close();

  return filePath;
};

const generateDutyPDF = async (driver) => {

  const dir = path.join(process.cwd(), "public/pdfs");

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const filePath = path.join(
    dir,
    `../../public/pdfs/7Days_${driver.FirstName}.pdf`
  );

  const html = await ejs.renderFile(
    path.join(__dirname, "../../views/Admin/Link/dutyHoursTemplate.ejs"),
    { data: driver }
  );

  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.setContent(html, { waitUntil: "load" });

  await page.pdf({
    path: filePath,
    format: "A4",
    printBackground: true,
  });

  await browser.close();

  return filePath;
};

const generateSSNPDF = async (driver) => {

  const dir = path.join(process.cwd(), "public/pdfs");

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const filePath = path.join(
    dir,
    `../../public/pdfs/SSn${driver.FirstName}.pdf`
  );

  const html = await ejs.renderFile(
    path.join(__dirname, "../../views/Admin/Link/ssnCard.ejs"),
    { data: driver }
  );

  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.setContent(html, { waitUntil: "load" });

  await page.pdf({
    path: filePath,
    format: "A4",
    printBackground: true,
  });

  await browser.close();

  return filePath;
};

const generatevoilationNPDF = async (driver) => {

  const dir = path.join(process.cwd(), "public/pdfs");

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const filePath = path.join(
    dir,
    `../../public/pdfs/voilation${driver.FirstName}.pdf`
  );

  const html = await ejs.renderFile(
    path.join(__dirname, "../../views/Admin/Link/voilationpdf.ejs"),
    { data: driver }
  );

  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.setContent(html, { waitUntil: "load" });

  await page.pdf({
    path: filePath,
    format: "A4",
    printBackground: true,
  });

  await browser.close();

  return filePath;
};

const consentData = {
  Consents1: {
    title: "FMCSA Clearinghouse Limited Query Consent",
    content: `
      <h3 class="text-center font-bold mb-3">General Consent for Limited Queries of the Federal Motor Carrier Safety Administration (FMCSA)</h3>
      <h4 class="text-center font-bold mb-3">Drug and Alcohol Clearinghouse</h4>
      <p class="mb-3">I, <strong>[Driver Name]</strong>, hereby provide consent to <strong><%= company?.name ? company.name.toUpperCase() : 'UNDEFINED' %></strong> to conduct a limited query of the FMCSA Commercial Driver’s License Drug and Alcohol Clearinghouse (Clearinghouse) to determine whether drug or alcohol violation information about me exists in the Clearinghouse.
I understand that if the limited query conducted by <strong><%= company?.name ? company.name.toUpperCase() : 'UNDEFINED' %></strong> indicates that drug or alcohol violation information about me exists in the Clearinghouse, FMCSA will not disclose that information to <strong><%= company?.name ? company.name.toUpperCase() : 'UNDEFINED' %></strong> without first obtaining additional specific consent from me.
I further understand that if I refuse to provide consent for <strong><%= company?.name ? company.name.toUpperCase() : 'UNDEFINED' %></strong> to conduct a limited query of the Clearinghouse, <strong><%= company?.name ? company.name.toUpperCase() : 'UNDEFINED' %></strong> must prohibit me from performing safety-sensitive functions, including driving a commercial motor vehicle, as required by FMCSA’s drug and alcohol program regulations.</p>
      <p class="mb-3">I understand that if the limited query indicates...</p>
    `
  },
  Consents2: {
    title: "FMCSA PSP Disclosure & Authorization",
     content: `
    <h3 class="text-center font-bold mb-3">The below disclosure and authorization language is for mandatory use by all account holders</h3>
      <h4 class="text-center font-bold mb-3">Important disclosure regarding background reports from the PSP online service</h4>

    <p class="mb-3">
      Driver Name: <strong>[Driver Name]</strong><br/>
      License #: <strong>[License #]</strong>
    </p>

    <p class="mb-3">
      In connection with your application for employment with <strong><%= company?.name ? company.name.toUpperCase() : 'AGONDH TRUCKS INC' %></strong> ("Prospective Employer"), the Prospective Employer, its employees, agents, or contractors may obtain one or more reports regarding your driving and safety inspection history from the Federal Motor Carrier Safety Administration (FMCSA).
    </p>

    <p class="mb-3">
      When the application for employment is submitted in person, if the Prospective Employer uses any information it obtains from FMCSA in a decision to not hire you or to make any other adverse employment decision, the Prospective Employer will provide you with a copy of the report and a written summary of your rights under the Fair Credit Reporting Act before taking any final adverse action.
    </p>

    <p class="mb-3">
      When the application is submitted by mail, telephone, computer, or other similar means, the Prospective Employer must provide notification within three business days if adverse action is taken based on FMCSA data. This includes notice of the action, FMCSA contact details, and your right to request a free copy of the report and dispute its accuracy.
    </p>

    <p class="mb-3">
      Neither the Prospective Employer nor the FMCSA contractor can correct safety data. You may challenge the accuracy of the data by submitting a request to 
      <a href="https://dataqs.fmcsa.dot.gov" target="_blank">https://dataqs.fmcsa.dot.gov</a>.
      Requests involving State-reported data will be forwarded to the appropriate State for review.
    </p>

    <p class="mb-3">
      Any crash or inspection in which you were involved will appear on your PSP report. The PSP does not assign fault and includes all reported CMV crashes and inspections, with or without violations. State citations tied to FMCSR violations that have been adjudicated will also appear.
    </p>

    <h3 class="text-center font-bold mb-3">Authorization</h3>

    <p class="mb-3">
      I authorize <strong><%= company?.name ? company.name.toUpperCase() : 'AGONDH TRUCKS INC' %></strong> to access the FMCSA Pre-Employment Screening Program (PSP) to obtain my commercial driving safety record, including crash data from the previous five (5) years and inspection history from the previous three (3) years.
    </p>

    <p class="mb-3">
      I understand that this information will be used to determine my suitability for employment and that neither the Prospective Employer nor FMCSA can correct inaccurate data. I may dispute inaccuracies through the DataQs system.
    </p>

    <p class="mb-3">
      I acknowledge that all crashes (regardless of fault) and all inspections (with or without violations) will be included in the PSP report, along with adjudicated FMCSR-related citations.
    </p>

    <p class="mb-3">
      I have read and understand this disclosure and authorize the Prospective Employer and its authorized agents to obtain my PSP report.
    </p>

    <p class="text-xs mt-4">
      NOTICE: This form is provided by NIC on behalf of the U.S. Department of Transportation FMCSA. Federal law requires applicant consent before accessing PSP reports. This language must be used exactly as provided and as a stand-alone document.
    </p>
  `
  },
  Consents3: {
    title: "Pre-Employment Employee Alcohol & Drug Test Statement",

  content: `
    <h3 class="text-center font-bold mb-3">PRE-EMPLOYMENT EMPLOYEE ALCOHOL & DRUG TEST STATEMENT</h3>

    <p class="mb-3">
      49 CFR Part 40.25(j) states, as the employer, you must ask the employee whether he or she has tested positive, or refused to test, on any pre-employment drug or alcohol test administered by an employer to which the employee applied for, but did not obtain, safety-sensitive transportation work covered by DOT agency drug and alcohol testing rules during the past two years. If the employee admits that he or she had a positive test or a refusal to test, you must not use the employee to perform safety-sensitive functions for you, until and unless the employee documents successful completion of the return-to-duty process required in 49 CFR Subpart O.
    </p>

    <p class="mb-3 text-red-600">
      You must request from the prospective employee, who violated a DOT drug and alcohol regulation, documentation of the employee's successful completion of DOT return-to-duty requirements (including follow-up tests). If the previous employer does not have information about the return-to-duty process (e.g., an employer who did not hire an employee who tested positive on a pre-employment test), you must seek to obtain this information from the prospective employee.
    </p>

    <p class="mb-2"><strong>Company Name:</strong> <u><%= company?.name ? company.name.toUpperCase() : 'undefined' %></u></p>
    <p class="mb-2"><strong>Address:</strong> <u><%= company?.Street %>, <%= company?.City %> ,<%= company?.State %>
          <%= company?.ZipCode %></u></p>
    <p class="mb-3"><strong>Prospective Employee Name:</strong> <u>[Driver Name]</u></p>

    <p class="mb-3">
      As the employer, you must ask the prospective employee whether he or she has:
    </p>

    <div class="mb-3">
      <p class="mb-2">
        <strong>1.</strong> Tested positive, or refused to test, on any pre-employment drug or alcohol test administered by an employer to which the employee applied for, but did not obtain, safety-sensitive transportation work covered by DOT agency drug and alcohol testing rules during the past two years.
      </p>
      <label class="mr-4">
       Yes
      </label>
     
    </div>

    <div class="mb-3">
      <p class="mb-2">
        <strong>2.</strong> If you answered yes to the above question, can you provide documentation of successful completion of DOT return-to-duty requirements (including follow-up tests)?
      </p>
      <label class="mr-4">
         Yes
      </label>
     
    </div>
  `

  },

   Consents4: {
    title: "Safety Performance History Investigationt",

   content: `
    <h3 class="text-center font-bold mb-3">Safety Performance History Investigation</h3>

    <p class="mb-3">
      I, <strong>[Driver Name]</strong>, hereby authorize release of information to this prospective employer from my employment file and my Department of Transportation regulated drug and alcohol testing records. This release is in accordance with DOT Regulation 49 CFR Parts 40.25/382.413/391.23.
    </p>

    <p class="mb-3">
      I understand that information to be released by my previous employer is limited to the previous three (3) years. I release all parties from any and all liability which may result from furnishing such information.
    </p>

    <p class="mb-3">
      Pursuant to the federal Fair Credit Reporting Act, I hereby authorize <strong><%= company?.name ? company.name.toUpperCase() : 'AGONDH TRUCKS INC' %></strong> and its designated agents and representatives to conduct a comprehensive review of my background through any consumer report for employment purposes.
    </p>

    <p class="mb-3">
      I understand that the scope of the consumer report or investigative consumer report may include, but is not limited to: verification of Social Security number; current and previous residences; employment history (including personnel files); education; references; credit history and reports; criminal history (from federal, state, or county jurisdictions); birth records; motor vehicle records (including traffic citations and registration); and other public records.
    </p>

    <p class="mb-3">
      I, <strong>[Driver Name]</strong>, understand that I have the right to review information provided by previous employers; to have errors corrected by the previous employer and for that employer to re-send corrected information; and to have a rebuttal statement attached if there is a disagreement regarding accuracy.
    </p>

    <p class="mb-3">
      I understand that to review previous employer-provided investigative information, I must submit a written request, which may be done at any time, including while applying, or up to thirty (30) days after being employed or notified of denial of employment.
    </p>

    <p class="mb-3">
      I understand that if I do not arrange to receive or pick up the requested records within thirty (30) days of their availability, it may be considered that I have waived my right to review those records.
    </p>

    <div class="mt-6">
      <p class="mb-2"><strong>Driver Signature:</strong> ____________________________</p>
      <p class="mb-2"><strong>Date:</strong> ____________________________</p>
    </div>
  `

  },
  Consents5: {
    title: "Employer Pull Notice Program Authorization (CA EPN)",

   content: `
    <h3 class="text-center font-bold mb-3">Employer Pull Notice Program</h3>
    <h4 class="text-center font-bold mb-4">Authorization for Release of Driver Record Information</h4>

    <h4 class="font-semibold mb-2">Section 1 - Driver Information</h4>

    <p class="mb-3">
      I, <strong>[Driver Name]</strong>, Driver License Number <strong>[License #]</strong>, hereby authorize the California Department of Motor Vehicles (DMV) to disclose or otherwise make available my driving record to my employer <strong><%= company?.name ? company.name.toUpperCase() : 'AGONDH TRUCKS INC' %></strong>.
    </p>

    <p class="mb-3">
      I understand that my employer may enroll me in the Employer Pull Notice (EPN) program to receive a driver record report at least once every twelve (12) months or when any subsequent conviction, failure to appear, accident, driver’s license suspension, revocation, or any other action is taken against my driving privilege during my employment.
    </p>

    <p class="mb-4">
      <strong>City:</strong> <u>______________</u><br/>
      <strong>State:</strong> <u>______________</u><br/>
      <strong>Country:</strong> United States
    </p>

    <h4 class="font-semibold mb-2">Section 2 - Authorized Representative Certification</h4>

    <p class="mb-3">
      I, <strong>[Driver Name]</strong> of <strong><%= company?.name ? company.name.toUpperCase() : 'AGONDH TRUCKS INC' %></strong>, do hereby certify under penalty of perjury under the laws in the State of California that I am an authorized representative of this company.
    </p>

    <p class="mb-4">
      <strong>City:</strong> <u>______________</u><br/>
      <strong>State:</strong> <u>______________</u><br/>
      <strong>Country:</strong> United States
    </p>

    <div class="mt-6">
      <p class="mb-2"><strong>Driver Signature:</strong> ____________________________</p>
      <p class="mb-2"><strong>Date:</strong> ____________________________</p>
    </div>
  `

  },
   Consents6: {
    title: "Motor Vehicle Record (MVR) Consent",

  content: `
    <h3 class="text-center font-bold mb-3">Motor Vehicle Record (MVR) Consent</h3>

    <p class="mb-3"><strong>To Whom It May Concern:</strong></p>

    <p class="mb-3">
      I, <strong>[Driver Name]</strong>, hereby give explicit consent to allow a representative of 
      <strong><%= company?.name ? company.name.toUpperCase() : 'AGONDH TRUCKS INC' %></strong> 
      to conduct an investigation into my driving and employment history in accordance with the Federal Motor Carrier Safety Administration (FMCSA) regulations, including 49 CFR Part 391.
    </p>

    <h4 class="font-semibold mb-2">1. Motor Vehicle Record (MVR) Check</h4>
    <p class="mb-3">
      <strong><%= company?.name ? company.name.toUpperCase() : 'AGONDH TRUCKS INC' %></strong> is authorized to obtain a Motor Vehicle Record (MVR) from each state in which I hold or have held a motor vehicle operator’s license or permit over the past three (3) years, as required by FMCSA 49 CFR Part 391.23. This MVR check may include:
    </p>
    <ul class="list-disc ml-6 mb-3">
      <li>Driving violations, including speeding tickets, reckless driving, or other infractions.</li>
      <li>DUI/DWI convictions and other serious traffic violations.</li>
      <li>Accident history, including at-fault accidents or other incidents.</li>
      <li>License suspensions, revocations, or restrictions.</li>
      <li>Drug and alcohol testing history, as mandated by FMCSA 49 CFR Part 382.</li>
    </ul>

    <h4 class="font-semibold mb-2">2. Employment Verification</h4>
    <p class="mb-3">
      I authorize <strong><%= company?.name ? company.name.toUpperCase() : 'AGONDH TRUCKS INC' %></strong> to contact my past employers to verify my employment history, including:
    </p>
    <ul class="list-disc ml-6 mb-3">
      <li>Length of employment (including probationary period if applicable).</li>
      <li>Status of employment (full-time, part-time, or temporary).</li>
      <li>Gross base annual salary at the time of employment.</li>
      <li>Current year-to-date income, if available.</li>
      <li>Job title or role.</li>
      <li>History of infractions, violations, or misconduct.</li>
      <li>Whether proper notice was given before leaving.</li>
      <li>Termination or resignation details and reasons for leaving.</li>
      <li>Drug testing history, including violations or refusals under FMCSA regulations.</li>
    </ul>

    <h4 class="font-semibold mb-2">3. Consent to Review Drug and Alcohol Test Results</h4>
    <p class="mb-3">
      I authorize <strong><%= company?.name ? company.name.toUpperCase() : 'AGONDH TRUCKS INC' %></strong> to obtain and review my drug and alcohol testing history in compliance with FMCSA regulations (49 CFR Part 40 and Part 382), including:
    </p>
    <ul class="list-disc ml-6 mb-3">
      <li>Past drug and alcohol test results, including positive tests and refusals.</li>
      <li>Any required return-to-duty process.</li>
      <li>Compliance with FMCSA drug and alcohol program requirements.</li>
    </ul>

    <p class="mb-3">
      I understand that these checks are part of the pre-employment screening process and are required by law under FMCSA regulations. I acknowledge that any discrepancies or negative findings may result in disqualification from employment consideration.
    </p>

    <h4 class="font-semibold mb-2">4. Certification and Acknowledgment</h4>
    <p class="mb-3">
      I certify that the information provided in this consent form is true and complete to the best of my knowledge. I understand that any falsification or omission may result in disqualification or termination.
    </p>

    <div class="mt-6">
      <p class="mb-2"><strong>Driver Signature:</strong> ____________________________</p>
      <p class="mb-2"><strong>Date:</strong> ____________________________</p>
    </div>
  `
  },

 Consents7: {
    title: "General Work Policy & Driver Handbook Acknowledgment",
    content: `
    <h3 class="text-center font-bold mb-3">GENERAL WORK POLICY & DRIVER HANDBOOK ACKNOWLEDGMENT</h3>

    <p class="mb-3">
      This policy acknowledgment applies to <strong><%= company?.name ? company.name.toUpperCase() : 'AGONDH TRUCKS INC' %></strong> and is intended as general guidance for safe and compliant operations. Drivers and employees must follow all applicable federal, state, and local laws and regulations, including DOT/FMCSA requirements.
    </p>

    <div class="border border-red-300 bg-red-50 p-3 mb-4">
      <p class="text-red-700 text-sm">
        <strong>Important Notice:</strong> This document is a guide only. Responsibility for compliance remains with the driver/operator. Violations, citations, fines, and penalties may result from non-compliance with laws, regulations, or safe operating practices.
      </p>
    </div>

    <h4 class="font-semibold mb-2">1. Receipt & Acknowledgment</h4>
    <p class="mb-3">
      I, <strong>[Driver Name]</strong>, acknowledge that I have received access to the Driver Handbook / Safety Manual and related policies. I understand it is my responsibility to read, understand, and comply with these policies at all times while performing work for the company.
    </p>
    <p class="mb-3">
      I understand these policies may be updated, revised, or supplemented at any time. I agree to comply with the most current policies provided by <strong><%= company?.name ? company.name.toUpperCase() : 'AGONDH TRUCKS INC' %></strong>.
    </p>

    <h4 class="font-semibold mb-2">2. General Safety & Compliance Expectations</h4>
    <ul class="list-disc ml-6 mb-3">
      <li>Operate legally and safely at all times (speed limits, weight limits, route restrictions).</li>
      <li>Hours of Service logs must be accurate and compliant; falsification is strictly prohibited.</li>
      <li>Vehicle inspection is required; report defects immediately and do not operate unsafe equipment.</li>
      <li>Accidents/incidents must be reported promptly per company procedures.</li>
      <li>Professional conduct is required with customers, public, and company staff.</li>
    </ul>

    <h4 class="font-semibold mb-2">3. Prohibited Conduct</h4>
    <ul class="list-disc ml-6 mb-3">
      <li>Drugs & alcohol are strictly prohibited during duty or while operating equipment.</li>
      <li>Firearms/weapons are prohibited unless authorized in writing and permitted by law.</li>
      <li>Unauthorized passengers or pets are not allowed unless approved in writing.</li>
      <li>Dishonesty, theft, or cargo tampering is strictly prohibited.</li>
      <li>Harassment, discrimination, or violence will not be tolerated.</li>
    </ul>

    <h4 class="font-semibold mb-2">4. Communication & Dispatch Expectations</h4>
    <ul class="list-disc ml-6 mb-3">
      <li>Provide call checks and status updates as requested by dispatch.</li>
      <li>Notify dispatch immediately of delays, breakdowns, or hazards.</li>
      <li>Maintain professional communication at all times.</li>
    </ul>

    <h4 class="font-semibold mb-2">5. Paperwork & Documentation</h4>
    <ul class="list-disc ml-6 mb-3">
      <li>Submit required paperwork promptly (BOLs, PODs, logs, inspections).</li>
      <li>Incomplete documentation may delay payroll, settlement, or invoicing.</li>
    </ul>

    <h4 class="font-semibold mb-2">6. Discipline, Probation & Termination</h4>
    <p class="mb-3">
      Violations of safety rules, compliance requirements, or company policies may result in disciplinary action including termination.
    </p>
    <ul class="list-disc ml-6 mb-3">
      <li>Immediate termination may occur for serious violations (theft, falsification, safety negligence).</li>
      <li>Progressive discipline may include warnings, suspension, probation, or termination.</li>
    </ul>

    <h4 class="font-semibold mb-2">7. Hand-Held Device & Distracted Driving Policy</h4>
    <p class="mb-3">
      I understand that distracted driving is a serious safety risk and agree to comply with all laws and company policies regarding device usage.
    </p>
    <ul class="list-disc ml-6 mb-3">
      <li>Hand-held device use while driving is prohibited unless legally permitted.</li>
      <li>Communication must be done only when safely parked.</li>
      <li>Texting while driving is strictly prohibited.</li>
    </ul>

    <h4 class="font-semibold mb-2">8. Agreement</h4>
    <p class="mb-3">
      By signing below, I confirm that I understand and agree to comply with all policies of <strong><%= company?.name ? company.name.toUpperCase() : 'AGONDH TRUCKS INC' %></strong> and all applicable laws while performing work duties.
    </p>

    <div class="mt-6">
      <p class="mb-2"><strong>Driver Name:</strong> <u>[Driver Name]</u></p>
      <p class="mb-2"><strong>Driver Signature:</strong> ____________________________</p>
      <p class="mb-2"><strong>Date:</strong> ____________________________</p>
    </div>
  `
  },


  Consents8: {
    title: "Drug & Alcohol Policy Acknowledgment",
   content: `
    <h3 class="text-center font-bold mb-3">Drug & Alcohol Policy Acknowledgment</h3>

    <p class="mb-3">
      This policy applies to <strong><%= company?.name ? company.name.toUpperCase() : 'AGONDH TRUCKS INC' %></strong> and is established in accordance with the Federal Motor Carrier Safety Administration (FMCSA) regulations contained in 49 CFR Part 40 and 49 CFR Part 382.
    </p>

    <div class="border border-red-300 bg-red-50 p-3 mb-4">
      <p class="text-red-700 text-sm">
        <strong>Important Notice:</strong> This document is provided as a compliance guide. Responsibility for adherence to DOT/FMCSA regulations remains with the driver. Violations, citations, penalties, or enforcement actions are the responsibility of the individual operator.
      </p>
    </div>

    <h4 class="font-semibold mb-2">1. Policy Purpose</h4>
    <p class="mb-3">
      The purpose of this policy is to promote public safety, protect driver health, and ensure compliance with FMCSA regulations governing the misuse of alcohol and controlled substances by drivers performing safety-sensitive functions.
    </p>

    <h4 class="font-semibold mb-2">2. Covered Drivers</h4>
    <p class="mb-3">
      This policy applies to all drivers operating Commercial Motor Vehicles (CMVs) requiring a CDL, including full-time, part-time, temporary, leased drivers, and owner-operators performing work for <strong><%= company?.name ? company.name.toUpperCase() : 'AGONDH TRUCKS INC' %></strong>.
    </p>

    <h4 class="font-semibold mb-2">3. Prohibited Conduct</h4>
    <ul class="list-disc ml-6 mb-3">
      <li>Use, possession, or distribution of controlled substances while performing safety-sensitive functions.</li>
      <li>Reporting for duty with an alcohol concentration of 0.04 or greater.</li>
      <li>Use of alcohol within 4 hours prior to safety-sensitive functions.</li>
      <li>Use of alcohol within 8 hours following an accident or until post-accident testing is completed.</li>
      <li>Refusal to submit to required drug or alcohol testing.</li>
      <li>Adulterated or substituted test specimens.</li>
    </ul>

    <p class="mb-3">
      <strong>Note:</strong> A driver with an alcohol concentration between 0.02 and 0.039 shall not perform safety-sensitive functions for at least 24 hours.
    </p>

    <h4 class="font-semibold mb-2">4. Required Testing Types</h4>
    <ul class="list-disc ml-6 mb-3">
      <li>Pre-employment</li>
      <li>Post-accident</li>
      <li>Random</li>
      <li>Reasonable suspicion</li>
      <li>Return-to-duty</li>
      <li>Follow-up</li>
    </ul>

    <p class="mb-3">
      All testing will be conducted in compliance with 49 CFR Part 40 using DOT-approved laboratories, collection sites, and Medical Review Officers (MROs).
    </p>

    <h4 class="font-semibold mb-2">5. Refusal to Test</h4>
    <p class="mb-3">
      A refusal to test is treated the same as a positive test result and includes:
    </p>
    <ul class="list-disc ml-6 mb-3">
      <li>Failure to appear for testing when directed.</li>
      <li>Failure to remain at the testing site.</li>
      <li>Failure to provide a sufficient specimen without medical justification.</li>
      <li>Failure to cooperate with testing procedures.</li>
      <li>Adulteration or substitution of a specimen.</li>
    </ul>

    <h4 class="font-semibold mb-2">6. Consequences of Violations</h4>
    <p class="mb-3">
      Drivers violating this policy will be immediately removed from safety-sensitive functions and may not return until completing SAP evaluation and required return-to-duty procedures.
    </p>

    <ul class="list-disc ml-6 mb-3">
      <li>Substance Abuse Professional (SAP) evaluation required.</li>
      <li>Completion of recommended education or treatment.</li>
      <li>Successful return-to-duty test.</li>
      <li>Completion of follow-up testing program.</li>
    </ul>

    <h4 class="font-semibold mb-2">7. Prescription & Over-the-Counter Medications</h4>
    <p class="mb-3">
      Drivers must disclose any medications that may affect their ability to safely operate a CMV. Medication use is only permitted if prescribed by a licensed medical provider confirming it does not impair driving ability.
    </p>

    <h4 class="font-semibold mb-2">8. Records & Confidentiality</h4>
    <p class="mb-3">
      All drug and alcohol testing records are maintained confidentially in accordance with FMCSA regulations and will only be released with written consent or as required by law.
    </p>

    <h4 class="font-semibold mb-2">9. Acknowledgment</h4>
    <p class="mb-3">
      By signing below, I confirm that I understand the Drug & Alcohol Policy of <strong><%= company?.name ? company.name.toUpperCase() : 'AGONDH TRUCKS INC' %></strong> and agree to fully comply with all FMCSA regulations as a condition of employment or performing safety-sensitive functions.
    </p>

    <div class="mt-6">
      <p class="mb-2"><strong>Driver Name:</strong> <u>[Driver Name]</u></p>
      <p class="mb-2"><strong>Driver Signature:</strong> ____________________________</p>
      <p class="mb-2"><strong>Date:</strong> ____________________________</p>
    </div>
  `
  },
};
async function generateConsentPDF(driver, consentKey, company) {
  const browser = await puppeteer.launch({
    headless: "new"
  });

  const page = await browser.newPage();

  const fullName = `${driver.FirstName || ""} ${driver.LastName || ""}`.trim();

  // 👉 get correct consent
  let consent = consentData[consentKey];

  if (!consent) throw new Error("Invalid consent key");

  // 👉 replace dynamic values
let content = await ejs.render(consent.content, {
  company,
});

// then replace simple placeholders
content = content
  .replace(/\[Driver Name\]/g, fullName)
  .replace(/\[License #\]/g, driver.LicenseNumber || "");

const html = `
<html>
<head>
<style>
  body {
    font-family: Arial, sans-serif;
    padding: 25px 40px;
    font-size: 12px;
    color: #333;
    line-height: 1.6;
  }

  .header {
    text-align: center;
    margin-bottom: 10px;
  }

  .company-name {
    font-size: 18px;
    font-weight: bold;
  }

  .company-address {
    font-size: 11px;
    margin-top: 3px;
  }

  .generated-date {
    font-size: 10px;
    margin-top: 3px;
    color: #666;
  }

  .driver-box {
    border: 1px solid #ccc;
    padding: 10px;
    margin-top: 15px;
    margin-bottom: 20px;
  }

  .driver-row {
    display: flex;
    justify-content: space-between;
    margin-bottom: 5px;
  }

  hr {
    margin: 15px 0;
  }

  ul {
    margin-left: 20px;
  }

  .signature {
    margin-top: 40px;
  }

  .signature img {
    width: 180px;
    border: 1px solid #ccc;
    padding: 4px;
  }

</style>
</head>

<body>

  <!-- COMPANY HEADER -->
  <div class="header">
    <div class="company-name">
      ${(company?.name || "").toUpperCase()}
    </div>

    <div class="company-address">
      ${company?.Street || ""}, 
      ${company?.City || ""}, 
      ${company?.State || ""} 
      ${company?.ZipCode || ""}, 
      United States
    </div>

    <div class="generated-date">
      Generated on: ${new Date().toLocaleDateString()}
    </div>
  </div>

  <hr/>

  <!-- DRIVER INFO BOX -->
  <div class="driver-box">
    <div class="driver-row">
      <div><strong>Driver:</strong> ${fullName}</div>
      <div><strong>License:</strong> ${driver.LicenseNumber || ""}</div>
    </div>

    <div class="driver-row">
      <div><strong>Email:</strong> ${driver.Email || ""}</div>
      <div><strong>Phone:</strong> ${driver.Contact || ""}</div>
    </div>
  </div>

  <!-- CONSENT CONTENT -->
  ${content}

  <!-- SIGNATURE -->
  <div class="signature">
    <strong>Driver Signature:</strong><br/>
    ${
      driver.Sign
        ? `<img src="${driver.Sign}" />`
        : "_____________________________"
    }
  </div>

</body>
</html>
`;

  await page.setContent(html, { waitUntil: "load" });

  const fileName = `${consentKey}-${driver._id}.pdf`;
  const filePath = path.join(__dirname, "../../public/consentpdf", fileName);

  await page.pdf({
    path: filePath,
    format: "A4",
    printBackground: true
  });

  await browser.close();

  return filePath;
}


module.exports = {
    slug: async (req, res) => {
        try {
          let title = "";
          const company = await LinkModel.findOne({ slug: req.params.slug });

          res.render("Admin/Form/addDriver.ejs", {
            title,
            company,
            session: req.session.user,
            msg: req.flash("msg"),
          });
        } catch (error) {
          console.log(error);
        }
      },



create_Driver: async (req, res) => {
  try {

    // ================= IMAGE UPLOAD =================
    if (req.files?.image) {
      req.body.image = await helper.imageUpload(req.files.image, "images");
    }

    if (req.files?.image1) {
      req.body.image1 = await helper.imageUpload(req.files.image1, "images");
    }

    if (req.files?.medicalImage) {
      req.body.medicalImage = await helper.imageUpload(req.files.medicalImage, "images");
    }

    if (req.files?.ssnImage) {
      req.body.ssnImage = await helper.imageUpload(req.files.ssnImage, "images");
    }

    // ================= COMPANY =================
    const company = await LinkModel.findOne({ slug: req.params.slug });
    if (!company) {
      return res.status(404).json({ success: false, message: "Company Not Found" });
    }

    // ================= PARSE =================
    let consents = req.body.consents ? JSON.parse(req.body.consents) : {};
    let bodyData = req.body.data ? JSON.parse(req.body.data) : {};

    const Driver = await Model.Driver.create({
      companyLinkId: company._id,
      ...bodyData,
      ...consents,
      Sign: req.body.Sign,
      licensefront: req.body.image,
      licenseback: req.body.image1,
      MedicalImg: req.body.medicalImage,
      SocialSecurityImg: req.body.ssnImage,
    });

    // ✅ FAST RESPONSE
    res.status(200).json({
      success: true,
      data: Driver
    });

const driver = await Model.Driver.findById(Driver._id).lean();

const trueConsents = Object.keys(driver)
  .filter((key) => key.startsWith("Consents") && driver[key] === true);

// console.log("trueConsentstrueConsents",trueConsents);
    const consentPDFs = await Promise.all(
      trueConsents.map((consentKey) =>
        generateConsentPDF(driver, consentKey,company)
      )
    );
    // 🔥 DELAY THODA JEHA (IMPORTANT)
    setImmediate(async () => {
      try {

        console.log("Starting PDF generation...");

        const [
          pdfPath,
          Dutypdf,
          Medicalpdf,
          SSnpdf,
          Voilationpdf
        ] = await Promise.all([
          generatePDF(Driver),
          generateDutyPDF(Driver),
          generateMedicalPDF(Driver),
          generateSSNPDF(Driver),
          generatevoilationNPDF(Driver)
        ]);

        // Server path → Live URL convert karo
        const toUrl = (filePath) => {
          if (!filePath) return '';
          const fileName = path.basename(filePath);
          return `${BASE_URL}/pdfs/${fileName}`;
        };
        const toConsentUrl = (filePath) => {
          if (!filePath) return '';
          const fileName = path.basename(filePath);
          return `${BASE_URL}/consentpdf/${fileName}`;
        };

        await pdfmodel.create({
          Driverid: Driver._id,
          EmploymentApplication: toUrl(pdfPath),
          Dayscert: toUrl(Dutypdf),
          MedicalCertificate: toUrl(Medicalpdf),
          SocialSecurityCard: toUrl(SSnpdf),
          Violations: toUrl(Voilationpdf),
          Consents: consentPDFs.map(toConsentUrl)
        });

        console.log("PDFs Generated Successfully ✅");

      } catch (error) {
        console.error("PDF Background Error ❌", error);
      }
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Server Error"
    });
  }
},
      Companydocument: async (req, res) => {
        console.log("UPLOAD API HIT");
        try {
          if (req.files?.MVRRecord) {
            req.body.MVRRecord = helper.imageUpload(req.files.MVRRecord, "images");
          }
          if (req.files?.RoadTest) {
            req.body.RoadTest = helper.imageUpload(req.files.RoadTest, "images");
          }
          if (req.files?.ClearingHouse) {
            req.body.ClearingHouse = helper.imageUpload(req.files.ClearingHouse, "images");
          }
        
          const updated = await pdfmodel.findOneAndUpdate(
            { Driverid: req.params.id },   // find by driver id
            {
              $set: {
                MVRRecord: req.body.MVRRecord,
                RoadTest: req.body.RoadTest,
                ClearingHouse: req.body.ClearingHouse,
              }
            },
            { new: true } // updated document return karega
          );
          console.log(updated,"updatedupdatedupdatedupdatedupdated")
          return res.json({
            success: true,
            company: updated
          });
        } catch (error) {
          console.log(error);
        }
      },


      
  

}