class ApplicationDto {
  id: string;
  title: string;
  JobPosting: {
    id: string;
    title: string;
  };
}

export class GetApplicationsResponseDto {
  applications: ApplicationDto[];

  constructor(applications: ApplicationDto[]) {
    this.applications = applications;
  }
}
