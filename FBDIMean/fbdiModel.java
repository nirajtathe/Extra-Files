

import fbdimodel.*;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.util.List;

import javax.xml.ws.BindingProvider;

import com.oracle.xmlns.apps.financials.commonmodules.shared.model.erpintegrationservice.DocumentDetails;
import com.oracle.xmlns.apps.financials.commonmodules.shared.model.erpintegrationservice.ErpIntegrationService;
import com.oracle.xmlns.apps.financials.commonmodules.shared.model.erpintegrationservice.ErpIntegrationService_Service;
import com.oracle.xmlns.apps.financials.commonmodules.shared.model.erpintegrationservice.ObjectFactory;
import com.oracle.xmlns.apps.financials.commonmodules.shared.model.erpintegrationservice.ServiceException;
import java.nio.file.Files;
import java.nio.file.Paths;

import utils.DecodeBase64;
import utils.LogMessages;

public class FBDIModel {

    String username, password;

    public FBDIModel(String username, String password) {
        this.username = username;
        this.password = password;
    }
    
    public void getEssjobLogsDownloaded(String request, String location) throws ServiceException, IOException {
        ErpIntegrationService_Service service = new ErpIntegrationService_Service();
        ErpIntegrationService port = service.getPort(ErpIntegrationService.class);
        BindingProvider prov = (BindingProvider) port;
        prov.getRequestContext().put(BindingProvider.USERNAME_PROPERTY, this.username);
        prov.getRequestContext().put(BindingProvider.PASSWORD_PROPERTY, this.password);
        List<DocumentDetails> retStatus = port.downloadESSJobExecutionDetails(request, null);
        DocumentDetails get = retStatus.get(0);
        byte[] content = get.getContent();
        Files.write(Paths.get(location+File.separator+get.getDocumentName().getValue()), content);
    }

    
    private byte[] getByteArray(String fileName) throws IOException {
        File file = new File(fileName);
        FileInputStream is = null;
        ByteArrayOutputStream buffer = new ByteArrayOutputStream();
        int nRead;
        byte[] data = new byte[16384];
        is = new FileInputStream(file);
        while ((nRead = is.read(data, 0, data.length)) != -1) {
            buffer.write(data, 0, nRead);
        }
        buffer.flush();
        is.close();
        return buffer.toByteArray();
    }

    public String invokeUpload(String fileLocation, String fileName, String contentType,
            String docTitle, String docName, String docAuthor,
            String ucmAccountInfo, String ucmSecurityGroup) throws ServiceException, IOException {

        System.out.println("inside Invokeupload");
        System.out.println("inputs: " + fileLocation + " " + fileName + " " + contentType + " " + docTitle + " " + docName + " " + docAuthor + " " + ucmAccountInfo + " " + ucmSecurityGroup);

        ErpIntegrationService_Service service = new ErpIntegrationService_Service();
        ErpIntegrationService port = service.getPort(ErpIntegrationService.class);
        BindingProvider prov = (BindingProvider) port;
        prov.getRequestContext().put(BindingProvider.USERNAME_PROPERTY, this.username);
        prov.getRequestContext().put(BindingProvider.PASSWORD_PROPERTY, this.password);
        ObjectFactory objectFactory = new ObjectFactory();
        DocumentDetails documentDet = new DocumentDetails();
        byte[] byteArray = getByteArray(fileLocation);
        System.out.println("COnverted to bbytes: " + byteArray);
        documentDet.setContent(byteArray);
        documentDet.setContentType(objectFactory.createDocumentDetailsContentType(contentType));
        documentDet.setDocumentAccount(objectFactory.createDocumentDetailsDocumentAccount(ucmAccountInfo));
        documentDet.setDocumentAuthor(objectFactory.createDocumentDetailsDocumentAuthor(docAuthor));
        documentDet.setDocumentSecurityGroup(objectFactory.createDocumentDetailsDocumentSecurityGroup(ucmSecurityGroup));
        documentDet.setDocumentTitle(objectFactory.createDocumentDetailsDocumentTitle(docTitle));
        documentDet.setDocumentName(objectFactory.createDocumentDetailsDocumentName(docName));
        documentDet.setFileName(fileName);
        System.out.println("Calling...");
        String retStatus = port.uploadFileToUcm(documentDet);
        System.out.println("output: " + retStatus);
        return retStatus;
    }

    public long invokeESSJOB(String jobPackage, String jobName, List<String> paramList) throws ServiceException {
        System.out.println("invoke essjob");
        System.out.println("inputs: " + jobPackage + " " + jobName + " " + paramList);
        ErpIntegrationService_Service service = new ErpIntegrationService_Service();
        ErpIntegrationService port = service.getPort(ErpIntegrationService.class);
        BindingProvider prov = (BindingProvider) port;
        prov.getRequestContext().put(BindingProvider.USERNAME_PROPERTY, this.username);
        prov.getRequestContext().put(BindingProvider.PASSWORD_PROPERTY, this.password);
        long retStatus = port.submitESSJobRequest(jobPackage, jobName, paramList);
        System.out.println("output: " + retStatus);
        return retStatus;
    }

    public String getEssjobStatus(long requestId) throws ServiceException {
        System.out.println("inside getEssJobStatus");
        System.out.println("input: " + requestId);
        ErpIntegrationService_Service service = new ErpIntegrationService_Service();
        ErpIntegrationService port = service.getPort(ErpIntegrationService.class);
        BindingProvider prov = (BindingProvider) port;
        prov.getRequestContext().put(BindingProvider.USERNAME_PROPERTY, this.username);
        prov.getRequestContext().put(BindingProvider.PASSWORD_PROPERTY, this.password);
        String retStatus = port.getESSJobStatus(requestId);
        System.out.println("output: " + retStatus);
        return retStatus;
    }

    public List<DocumentDetails> downloadEssJobStatus(String requestId) throws ServiceException {

        ErpIntegrationService_Service service = new ErpIntegrationService_Service();
        ErpIntegrationService port = service.getPort(ErpIntegrationService.class);
        System.out.println("inside downloadEssJobStatus");
        System.out.println("input: " + requestId);
        BindingProvider prov = (BindingProvider) port;
        prov.getRequestContext().put(BindingProvider.USERNAME_PROPERTY, this.username);
        prov.getRequestContext().put(BindingProvider.PASSWORD_PROPERTY, this.password);
        List<DocumentDetails> retStatus = port.downloadESSJobExecutionDetails(requestId, "zip");
        System.out.println("output: " + retStatus);
        return retStatus;
    }

    public DocumentDetails getDocFromDocId(String docId, String location) throws ServiceException {
        ErpIntegrationService_Service service = new ErpIntegrationService_Service();
        ErpIntegrationService port = service.getPort(ErpIntegrationService.class);
        System.out.println("inside getDocFromDocId");
        System.out.println("input: " + docId + " " + location);
        BindingProvider prov = (BindingProvider) port;
        prov.getRequestContext().put(BindingProvider.USERNAME_PROPERTY, this.username);
        prov.getRequestContext().put(BindingProvider.PASSWORD_PROPERTY, this.password);
        DocumentDetails retStatus = port.getDocumentForDocumentId(docId);
        byte b[] = retStatus.getContent();
        String str = new String(b);
        System.out.println(str);
        DecodeBase64.decode(str, location);
        System.out.println("output: decoded at " + location);
        return retStatus;
    }

    public boolean validateLib() {
        try {
            Class.forName("com.oracle.xmlns.apps.financials.commonmodules.shared.model.erpintegrationservice.ErpIntegrationService_Service");
            return true;
        } catch (ClassNotFoundException e) {
            LogMessages.exceptionStack(e);
            return false;
        }
    }
    
    public static void main(String[] args) throws ServiceException, IOException {
        System.getProperties().put("https.proxyHost", "10.76.242.101");
            System.getProperties().put("https.proxyPort", "80");
        byte[] byteArray = new FBDIModel("Kiran_Mathew@infosys.com", "Infosys@1").getByteArray("C:\\Users\\sarvesh.tank.ITLINFOSYS\\Desktop\\InvTransactionsInterface_8_nov.zip");
        System.err.println(new String(byteArray));
    }
   
}
