import { Injectable } from "@angular/core";
import { DataAccessService } from "../data-access.service";
import { ResourceService } from "../resource.service";

@Injectable({
  providedIn: "root",
})
export class ProductService {
  constructor(
    private dataAccess: DataAccessService,
    private resource: ResourceService
  ) {}

  SaveProduct(body: any) {
    return this.dataAccess
      .POST(this.resource.product.saveProduct, body)
      .pipe((response) => {
        return response;
      });
  }

  UpdateProduct(body: any, id: string) {
    return this.dataAccess
      .PUT(this.resource.product.updateProduct + `/${id}`, body)
      .pipe((response) => {
        return response;
      });
  }

  DeleteProduct(id: string) {
    return this.dataAccess
      .DELETE(this.resource.product.deleteProduct + `/${id}`)
      .pipe((response) => {
        return response;
      });
  }

  GetAllProducts(withInactive: boolean = false) {
    return this.dataAccess
      .GET(
        this.resource.product.getAllProducts + `?withInactive=${withInactive}`
      )
      .pipe((response) => {
        return response;
      });
  }

  ActiveInactiveProduct(id: string) {
    return this.dataAccess
      .PUT(this.resource.product.activeInactiveProduct + `/${id}`, null)
      .pipe((response) => {
        return response;
      });
  }

  GetProductById(id: string) {
    return this.dataAccess
      .GET(this.resource.product.getProductById + `/${id}`)
      .pipe((response) => {
        return response;
      });
  }
}
