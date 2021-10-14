using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using PizzApp.Models;
using PizzApp.Services;

namespace RealmReactPizza.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class OrdinazioniController : ControllerBase
    {

        private readonly ILogger<OrdinazioniController> _logger;

        public OrdinazioniController(ILogger<OrdinazioniController> logger)
        {
            _logger = logger;
        }

        [HttpGet]
        public async Task<string> Get()
        {
            string partition = "02";
            var listaOrdinazioni = await RealmDataStore.ListaOrdiniDaEvadere(partition);
            var obj=JsonConvert.SerializeObject(listaOrdinazioni);
            return obj;
        }
    }
}
